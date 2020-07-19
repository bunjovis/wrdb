require('dotenv').config();
const User = require('../server/models/User');
const UserRole = require('../server/models/UserRole');

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
