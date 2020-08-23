const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
const bcrypt = require('bcryptjs');
const UserRole = require('./UserRole');
require('dotenv').config();

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 254,
    unique: true,
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    set: (password) => {
      if (!password || password.length === 0) {
        return password;
      } else {
        return bcrypt.hashSync(password, parseInt(process.env.SALT, 10));
      }
    },
  },
  role: {
    type: Number,
    required: true,
    enum: [UserRole.ADMIN, UserRole.USER],
  },
});
userSchema.plugin(sanitizerPlugin, {
  include: ['name', 'email'],
  mode: 'escape',
});

module.exports = mongoose.model('User', userSchema);
