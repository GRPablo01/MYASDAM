const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: String,
  role: String,
  action: String,
  description: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);