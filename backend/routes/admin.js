const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const User = require('../models/User');
const Service = require('../models/Service');
const HaircutStyle = require('../models/HaircutStyle');
const DailyLimit = require('../models/DailyLimit');
const { auth, isAdmin } = require('../middleware/auth');
const { sendSMS } = require('../middleware/sms');
const moment = require('moment');

// Apply auth middleware to all admin routes
router.use(auth);
router.use(isAdmin);

// Get all queue items
router.get('/queue', async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const queues = await Queue.find(filter)
      .populate('user', 'name mobile')
      .populate('service', 'name duration')
      .sort({ queueNumber: 1 });
    
    res.json(queues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update queue status
router.put('/queue/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const queue = await Queue.findById(id).populate('user', 'name mobile');
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    const oldStatus = queue.status;
    queue.status = status;
    
    // Set timestamps based on status
    if (status === 'in-progress' && oldStatus === 'waiting') {
      queue.startTime = new Date();
    } else if (status === 'completed' && oldStatus === 'in-progress') {
      queue.endTime = new Date();
    }
    
    await queue.save();
    
    // Send SMS notifications for status changes
    if (status === 'in-progress' && oldStatus === 'waiting') {
      const message = `Hi ${queue.user.name}, the barber is ready for you. Please proceed to the barber station.`;
      await sendSMS(queue.user.mobile, message);
    }
    
    res.json({ message: 'Queue status updated successfully', queue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const waitingCount = await Queue.countDocuments({ 
      status: 'waiting',
      checkInTime: { $gte: todayStart, $lte: todayEnd }
    });
    
    const inProgressCount = await Queue.countDocuments({ 
      status: 'in-progress',
      checkInTime: { $gte: todayStart, $lte: todayEnd }
    });
    
    const completedCount = await Queue.countDocuments({ 
      status: 'completed',
      checkInTime: { $gte: todayStart, $lte: todayEnd }
    });
    
    const cancelledCount = await Queue.countDocuments({ 
      status: 'cancelled',
      checkInTime: { $gte: todayStart, $lte: todayEnd }
    });
    
    res.json({
      waiting: waitingCount,
      inProgress: inProgressCount,
      completed: completedCount,
      cancelled: cancelledCount,
      total: waitingCount + inProgressCount + completedCount + cancelledCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get records with filters
router.get('/records', async (req, res) => {
  try {
    const { period, status, page = 1, limit = 10 } = req.query;
    
    let dateFilter = {};
    
    if (period === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      dateFilter.checkInTime = { $gte: todayStart, $lte: todayEnd };
    } else if (period === 'week') {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      
      dateFilter.checkInTime = { $gte: weekStart };
    } else if (period === 'month') {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - 1);
      
      dateFilter.checkInTime = { $gte: monthStart };
    }
    
    let statusFilter = {};
    if (status && status !== 'all') {
      statusFilter.status = status;
    }
    
    const filter = { ...dateFilter, ...statusFilter };
    
    const records = await Queue.find(filter)
      .populate('user', 'name mobile')
      .populate('service', 'name price')
      .sort({ checkInTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Queue.countDocuments(filter);
    
    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete old records
router.delete('/records', async (req, res) => {
  try {
    const { days = 30 } = req.body;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await Queue.deleteMany({ 
      checkInTime: { $lt: cutoffDate } 
    });
    
    res.json({ 
      message: `Deleted ${result.deletedCount} records older than ${days} days` 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Haircut style management
router.post('/haircut-styles', async (req, res) => {
  try {
    const { name, description, image, isTrending } = req.body;
    
    const haircutStyle = new HaircutStyle({
      name,
      description,
      image,
      isTrending: isTrending || false
    });
    
    await haircutStyle.save();
    res.status(201).json(haircutStyle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/haircut-styles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isTrending } = req.body;
    
    const haircutStyle = await HaircutStyle.findByIdAndUpdate(
      id,
      { name, description, image, isTrending },
      { new: true }
    );
    
    if (!haircutStyle) {
      return res.status(404).json({ message: 'Haircut style not found' });
    }
    
    res.json(haircutStyle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/haircut-styles', async (req, res) => {
  try {
    const { trending } = req.query;
    
    let filter = {};
    if (trending === 'true') {
      filter.isTrending = true;
    }
    
    const haircutStyles = await HaircutStyle.find(filter).sort({ createdAt: -1 });
    res.json(haircutStyles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update daily limit
router.put('/daily-limit', async (req, res) => {
  try {
    const { maxCustomers } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyLimit = await DailyLimit.findOne({ date: today });
    
    if (dailyLimit) {
      dailyLimit.maxCustomers = maxCustomers;
    } else {
      dailyLimit = new DailyLimit({
        date: today,
        maxCustomers,
        currentCount: 0
      });
    }
    
    await dailyLimit.save();
    res.json({ message: 'Daily limit updated successfully', dailyLimit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;