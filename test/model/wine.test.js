/* eslint-disable no-unused-expressions */
const chai = require('chai');
const Comment = require('../../server/models/Comment').model;
const Ingredient = require('../../server/models/Ingredient').model;
const Wine = require('../../server/models/Wine');
const db = require('../../server/db');

const { expect } = chai;

describe('Wine Model', function () {
  describe('name', function () {
    it('should be a string', function () {});
    it('should exist', function () {});
    it('should be at least 1 character long', function () {});
    it('should not be over 200 characters long', function () {});
    it('should trim name', function () {});
  });
  describe('ingredients', function () {
    it('should be an array of Ingredients', function () {});
    it('should exist', function () {});
  });
  describe('startingGravity', function () {
    it('should be a number', function () {});
    it('should exist', function () {});
    it('should be atleast 1000', function () {});
    it('should not be over 1200', function () {});
  });
  describe('finalGravity', function () {
    it('should be a number', function () {});
    it('is not mandatory', function () {});
    it('should be atleast 990', function () {});
    it('should not be over 1200', function () {});
  });
  describe('startingVolume', function () {
    it('should be a number', function () {});
    it('should exist', function () {});
    it('should be atleast 0', function () {});
    it('should not be over 30', function () {});
  });
  describe('finalVolume', function () {
    it('should be a number', function () {});
    it('is not mandatory', function () {});
    it('should be atleast 0', function () {});
    it('should not be over 30', function () {});
  });
  describe('alcoholContent', function () {
    it('should be a number', function () {});
    it('is not mandatory', function () {});
    it('should be atleast 0', function () {});
    it('should not be over 20', function () {});
  });
  describe('bottlingDate', function () {
    it('should be a Date', function () {});
    it('is not mandatory', function () {});
  });
  describe('comments', function () {
    it('should be an array of Comments', function () {});
    it('is not mandatory', function () {});
  });
  describe('labelId', function () {
    it('should be a string', function () {});
    it('is not mandatory', function () {});
    it('should be at least 1 character long', function () {});
    it('should not be over 50 characters long', function () {});
    it('should trim labelId', function () {});
  });
  describe('timestamps', function () {
    it('should timestamp a saved Wine', function () {});
  });
});
