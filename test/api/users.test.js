/* eslint-disable no-unused-expressions */
const chai = require('chai');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const App = require('../../server/app');
const db = require('../../server/db');
require('dotenv').config();

const { expect } = chai;
let api;

describe('/api/users', function () {
  this.beforeAll((done) => {
    done();
  });
  this.afterAll((done) => {
    db.disconnect();
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
          });
        });
    });
  });
  describe('GET /', function () {});
  describe('POST /', function () {});
  describe('GET /:id', function () {});
  describe('PUT /:id', function () {});
  describe('DELETE /:id', function () {});
});
