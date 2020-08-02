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
let userToken;
let adminToken;

describe('/api/ingredients', function () {
  this.beforeAll(async function () {
    // Wait for setup script to create admin user
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Login as admin
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
  });
  describe('GET /', function () {
    it('should require login', function () {
      fetch('http://localhost:3000/api/ingredients', {
        method: 'GET',
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should return a list of ingredients', function () {
      fetch('http://localhost:3000/api/ingredients', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.ingredients.length).to.be.greaterThan(0);
        });
    });
  });
  describe('POST /', function () {
    it('should require login', function () {});
    it('should require a valid type', function () {});
    it('should require a valid amount', function () {});
    it('should require a valid comment', function () {});
    it('should escape HTML from comment', function () {});
    it('should return the created ingredient', function () {});
  });
  describe('GET /:id', function () {
    it('should require login', function () {});
    it('should reply with message "Error occured" to invalid id', function () {});
    it('should reply with message "Ingredient not found" when there is no ingredient with a valid id', function () {});
    it('should return correct ingredient', function () {});
  });
  describe('PUT /:id', function () {
    it('should require login', function () {});
    it('should require a valid type', function () {});
    it('should require a valid amount', function () {});
    it('should require a valid comment', function () {});
    it('should escape HTML from comment', function () {});
    it('should return the updated ingredient', function () {});
    it('should reply with message "Error occured" to invalid id', function () {});
  });
  describe('DELETE /:id', function () {
    it('should require login', function () {});
    it('should reply with message "Ingredient not found" to invalid id', function () {});
  });
});
