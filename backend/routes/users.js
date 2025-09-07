const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Queue = require('../models/Queue');
const Service = require('../models/Service');
const DailyLimit = require('../models/DailyLimit');
const { sendSMS } = require('../middleware/sms');

// Join queue
router.post('/join-queue', async (req, res) => {
  try {
    const { name, mobile, serviceId } = req.body;
    
    // Check if user already in queue
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      const existingQueue = await Queue.findOne({ 
        user: existingUser._id, 
        status: { $in: ['waiting', 'in-progress'] } 
      });
      
      if (existingQueue) {
        return res.status(400).json({ 
          message: 'You are already in the queue' 
        });
      }
    }
    
    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyLimit = await DailyLimit.findOne({ date: today });
    if (!dailyLimit) {
      dailyLimit = new DailyLimit({
        date: today,
        maxCustomers: 50 // Default limit
      });
      await dailyLimit.save();
    }
    
    if (dailyLimit.currentCount >= dailyLimit.maxCustomers) {
      return res.status(400).json({ 
        message: 'Sorry, we have reached our daily customer limit. Please try again tomorrow.' 
      });
    }
    
    // Create or find user
    let user = existingUser;
    if (!user) {
      user = new User({ name, mobile });
      await user.save();
    }
    
    // Get service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Get next queue number
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const lastQueue = await Queue.findOne({
      checkInTime: { $gte: todayStart, $lte: todayEnd }
    }).sort({ queueNumber: -1 });
    
    const queueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;
    
    // Calculate estimated wait time
    const waitingCustomers = await Queue.countDocuments({ 
      status: 'waiting',
      checkInTime: { $gte: todayStart, $lte: todayEnd }
    });
    
    const estimatedWaitTime = waitingCustomers * 15; // Assuming 15 minutes per customer
    
    // Create queue entry
    const queue = new Queue({
      user: user._id,
      service: service._id,
      queueNumber,
      estimatedWaitTime
    });
    
    await queue.save();
    
    // Update daily count
    dailyLimit.currentCount += 1;
    await dailyLimit.save();
    
    // Send confirmation SMS
    const message = `Hi ${name}, you've been added to the queue. Your queue number is ${queueNumber}. Estimated wait time: ${estimatedWaitTime} minutes.`;
    await sendSMS(mobile, message);
    
    res.status(201).json({
      message: 'Successfully joined the queue',
      queueNumber,
      estimatedWaitTime
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check queue status
router.get('/queue-status/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const queue = await Queue.findOne({ 
      user: user._id, 
      status: { $in: ['waiting', 'in-progress'] } 
    }).populate('service');
    
    if (!queue) {
      return res.status(404).json({ message: 'No active queue found' });
    }
    
    // Calculate position in queue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const waitingBefore = await Queue.countDocuments({
      status: 'waiting',
      checkInTime: { $gte: todayStart, $lte: todayEnd },
      queueNumber: { $lt: queue.queueNumber }
    });
    
    const position = waitingBefore + 1;
    const estimatedWait = position * 15; // Assuming 15 minutes per customer
    
    res.json({
      queueNumber: queue.queueNumber,
      status: queue.status,
      position,
      estimatedWait,
      service: queue.service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel queue
router.put('/cancel-queue/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const queue = await Queue.findOne({ 
      user: user._id, 
      status: 'waiting' 
    });
    
    if (!queue) {
      return res.status(404).json({ message: 'No active queue found to cancel' });
    }
    
    queue.status = 'cancelled';
    queue.endTime = new Date();
    await queue.save();
    
    // Send cancellation SMS
    const message = `Hi ${user.name}, your queue request has been cancelled.`;
    await sendSMS(mobile, message);
    
    res.json({ message: 'Queue cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;