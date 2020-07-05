const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
      return !password || password.length === 0
        ? password
        : bcrypt.hashSync(password, process.env.SALT);
    },
  },
});

userSchema.statics.verifyPassword = (email, password) => {
  this.find({ email: email }, (err, res) => {
    if (err) {
      return false;
    } else {
      bcrypt.compare(password, res.password, (err2, res2) => {
        return res2;
      });
    }
  });
};

module.exports = mongoose.model('User', userSchema);
