const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, doc) => {
    if (err || !doc) {
      return res.status(401).json({ message: 'Login failed' });
    } else {
      bcrypt.compare(password, doc.password, (err2, success) => {
        if (err2) {
          return res.status(401).json({ message: 'Login failed' });
        } else {
          if (success) {
            const token = jwt.sign({ id: doc._id }, process.env.SECRET);
            return res.status(200).json({
              message: 'Login succesful',
              token: token,
            });
          } else {
            return res.status(401).json({ message: 'Login failed' });
          }
        }
      });
    }
  });
};
const listUsers = (req, res) => {};
const addUser = (req, res) => {};
const showUser = (req, res) => {};
const editUser = (req, res) => {};
const deleteUser = (req, res) => {};

module.exports = {
  login,
  listUsers,
  addUser,
  showUser,
  editUser,
  deleteUser,
};
