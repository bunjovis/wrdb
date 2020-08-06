const User = require('../models/User');
const UserRole = require('../models/UserRole');
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
const listUsers = (req, res) => {
  if (req.userRole === UserRole.ADMIN) {
    User.find((err, res2) => {
      return res.status(200).json({ users: res2 });
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
const addUser = (req, res) => {
  if (req.userRole === UserRole.ADMIN) {
    const { name, email, password, role } = req.body;
    const user = new User({
      name: name,
      email: email,
      password,
      role,
    });
    user.save((err, doc) => {
      if (err || !doc) {
        return res.status(500).json({ message: 'Error occured', error: err });
      } else {
        return res.status(201).json({ message: 'New user created', user: doc });
      }
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
const showUser = (req, res) => {
  const id = req.params.id;
  if (req.userRole === UserRole.ADMIN || id === req.userId) {
    User.findOne({ _id: id }, (err, doc) => {
      if (err) {
        return res.status(500).json({ message: 'Error occured', error: err });
      }
      if (!doc) {
        return res.status(500).json({ message: 'User not found' });
      }

      return res.status(200).json({ user: doc });
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
const editUser = (req, res) => {
  const id = req.params.id;
  if (req.userRole === UserRole.ADMIN || id === req.userId) {
    const { name, email, password, role } = req.body;
    User.findById(id, (err, doc) => {
      if (err) {
        return res.status(500).json({ message: 'Error occured', error: err });
      }
      if (!doc) {
        return res.status(500).json({ message: 'User not found' });
      }

      if (name && name !== '') {
        doc.name = name;
      }
      if (name == '' || name == ' ') {
        return res.status(500).json({ message: 'Error occured', error: err });
      }
      if (email && email !== '') {
        doc.email = email;
      }
      if (email == '' || email == ' ') {
        return res.status(500).json({ message: 'Error occured', error: err });
      }
      if (password && password !== '') {
        doc.password = password;
      }
      if (password == '' || password == ' ') {
        return res.status(500).json({ message: 'Error occured', error: err });
      }
      if (role && role !== '') {
        doc.role = role;
      }
      doc.save({ runValidators: true }, (err2, doc2) => {
        if (err2) {
          return res
            .status(500)
            .json({ message: 'Error occured', error: err2 });
        }
        return res.status(200).json({ user: doc2 });
      });
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
const deleteUser = (req, res) => {
  const id = req.params.id;
  if (req.userRole === UserRole.ADMIN || id === req.userId) {
    User.findByIdAndRemove(id, (err, doc) => {
      if (!doc) {
        return res.status(500).json({ message: 'User not found' });
      }
      if (err) {
        return res.status(500).json({ message: 'Error occured', error: err });
      }
      return res.status(200).json({ user: doc });
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  login,
  listUsers,
  addUser,
  showUser,
  editUser,
  deleteUser,
};
