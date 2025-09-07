const mongoose = require('mongoose');

const dailyLimitSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  maxCustomers: {
    type: Number,
    required: true,
    min: 1
  },
  currentCount: {
    type: Number,
    default: 0,
    min: 0
  }
});

module.exports = mongoose.model('DailyLimit', dailyLimitSchema);