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

describe('/api/wines', function () {
  describe('GET /', function () {
    it('should require login', function () {});
    it('should return a list of ingredient types', function () {});
  });
  describe('POST /', function () {
    it('should require login', function () {});
    it('should return the created ingredient type', function () {});
  });
  describe('GET /:id', function () {
    it('should require login', function () {});
    it('should reply with message "Error occured" to invalid id', function () {});
    it('should reply with message "Ingredient type not found" when there is no ingredient type with a valid id', function () {});
    it('should return correct ingredient type', function () {});
  });
  describe('PUT /:id', function () {
    it('should require login', function () {});
    it('should return the updated ingredient type', function () {});
    it('should reply with message "Error occured" to invalid id', function () {});
  });
  describe('DELETE /:id', function () {
    it('should require login', function () {});
    it('should reply with message "Ingredient type not found" to invalid id', function () {});
  });
});
