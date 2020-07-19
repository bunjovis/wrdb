const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserRole = require('../../../../tieta12/data/i-want-all-the-3-points/server/models/UserRole');
require('dotenv').config();

const UserRole = {
  ADMIN: 1,
  USER: 2,
};

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
      return !password || password.length === 0
        ? password
        : bcrypt.hashSync(password, parseInt(process.env.SALT));
    },
  },
  role: {
    type: UserRole,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
