const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
  language: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 2,
  },
  darkMode: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Settings', settingsSchema);
