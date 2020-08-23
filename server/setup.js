require('dotenv').config();
const User = require('./models/User');
const UserRole = require('./models/UserRole');
const Settings = require('./models/Settings');

User.findOne({ email: process.env.ADMIN_EMAIL }, (err, res) => {
  if (!res) {
    const admin = new User({
      email: process.env.ADMIN_EMAIL,
      name: process.env.ADMIN_NAME,
      password: process.env.ADMIN_PASS,
      role: UserRole.ADMIN,
    });
    admin.save();
  }
});
Settings.find((err, res) => {
  if (!res || res.length == 0) {
    const settings = new Settings({
      darkMode: 'true',
      language: 'en',
    });
    settings.save();
  }
});
