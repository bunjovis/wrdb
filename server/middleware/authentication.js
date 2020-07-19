const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const secret = process.env.SECRET;

const verifyLogin = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1];
    if (token !== undefined) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res
            .status(400)
            .json({ message: 'Authentication error: invalid token provided.' });
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    } else {
      return res
        .status(401)
        .json({ message: 'Authentication error: no token provided' });
    }
  } else {
    return res
      .status(401)
      .json({ message: 'Authentication error: no token provided' });
  }
};
const verifyRole = (req, res, next) => {
  if (req.userId) {
    User.findById(req.userId, (err, user) => {
      if (user) {
        req.userRole = user.role;
        next();
      }
    });
  } else {
    next();
  }
};
module.exports = { verifyLogin, verifyRole };
