/* eslint-disable no-unused-expressions */
const chai = require('chai');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const App = require('../../server/app');
const db = require('../../server/db');
const User = require('../../server/models/User');
const UserRole = require('../../server/models/UserRole');
require('dotenv').config();

const { expect } = chai;
let api;
let user;
let userToken;
let adminToken;

describe('/api/users', function () {
  this.beforeAll(async function () {
    // Create normal user for tests
    user = new User({
      name: 'Normal user',
      email: 'user@normal.fi',
      password: 'suolapähkinä',
      role: UserRole.USER,
    });
    user.save();
    // Wait for setup script to create admin user
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
  this.afterAll((done) => {
    User.deleteOne({ email: 'user@normal.fi' }, (err) => {
      if (err) {
        console.log(err);
      }
    });
    done();
  });
  describe('POST /login', function () {
    it('should require valid email', function () {
      fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'väärä@tunnus.fi',
          password: process.env.ADMIN_PASS,
        }),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should require valid password', function () {
      fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL,
          password: 'väärä',
        }),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should login with correct credentials', function () {
      fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASS,
        }),
      }).then((res) => {
        expect(res.status).to.equal(200);
      });
    });
    it('should reply with message "Login successful"', function () {
      fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASS,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.message).to.equal('Login succesful');
        });
    });
    it('should reply with a valid token', function () {
      fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASS,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          jwt.verify(json.token, process.env.SECRET, function (err, decoded) {
            expect(err).to.not.exist;
            adminToken = json.token;
          });
        });
      fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: 'suolapähkinä',
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          jwt.verify(json.token, process.env.SECRET, function (err, decoded) {
            expect(err).to.not.exist;
            userToken = json.token;
          });
        });
    });
  });
  describe('GET /', function () {
    it('should require admin role', function () {
      fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
      fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      }).then((res) => {
        expect(res.status).to.equal(200);
      });
    });
    it('should return a list of users', function () {
      fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.users.length).to.be.greaterThan(0);
        });
    });
  });
  describe('POST /', function () {
    let newUser;
    beforeEach((done) => {
      newUser = {
        name: 'Erkki',
        email: 'erkki@erkkinen.fi',
        password: 'salasana',
        role: UserRole.USER,
      };
      done();
    });
    afterEach((done) => {
      User.findOneAndDelete({ email: newUser.email }, (err, res) => {
        done();
      });
    });
    it('should require admin role', function () {
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(201);
      });
    });
    it('should require a valid name', function () {
      newUser.name = { name: 'name' };
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newUser.name = ['name'];
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newUser.name = 'Erkki';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(201);
      });
    });
    it('should require a valid email', function () {
      newUser.email = 'erkki.fi.fi';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a unique email', function () {});
    it('should require a valid password', function () {});
    it('should require a valid role', function () {});
    it('should escape HTML from name', function () {});
    it('should escape HTML from email', function () {});
    it('should return the created user', function () {});
  });
  describe('GET /:id', function () {
    it('should require admin role or :id to be requesters id', function () {});
    it('should reply with message "User not found" to invalid id', function () {});
    it('should return a valid user', function () {});
  });
  describe('PUT /:id', function () {
    it('should require admin role or :id to be requesters id', function () {});
    it('should require a valid name', function () {});
    it('should require a valid email', function () {});
    it('should require a unique email', function () {});
    it('should require a valid password', function () {});
    it('should require a valid role', function () {});
    it('should escape HTML from name', function () {});
    it('should escape HTML from email', function () {});
    it('should return the updated user', function () {});
    it('should reply with message "User not found" to invalid id', function () {});
  });
  describe('DELETE /:id', function () {
    it('should require admin role or :id to be requesters id', function () {});
    it('should reply with message "User not found" to invalid id', function () {});
  });
});
