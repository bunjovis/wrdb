/* eslint-disable no-unused-expressions */
const chai = require('chai');
const Ingredient = require('../../server/models/Ingredient').model;
const IngredientType = require('../../server/models/IngredientType').model;

const { expect } = chai;

const validIngredientType = new IngredientType({
  name: 'Mustikka',
  unit: 'kg',
  price: 7.99,
});

describe('Ingredient Model', function () {
  describe('type', function () {
    it('should be a valid ObjectId string', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 1,
        comment: 'Pilko pieneksi ',
      });
      const err = ingredient.validateSync();
      expect(err).to.not.exist;
      const ingredient2 = new Ingredient({
        type: validIngredientType,
        amount: 1,
        comment: 'Väärä ',
      });
      const err2 = ingredient2.validateSync();
      expect(err2).to.exist;
      const ingredient3 = new Ingredient({
        type: 'aaa',
        amount: 1,
        comment: 'Väärä ',
      });
      const err3 = ingredient3.validateSync();
      expect(err3).to.exist;
    });
    it('should exist', function () {
      const ingredient = new Ingredient({
        amount: 1,
        comment: 'Pilko pieneksi ',
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
    });
    it('should not allow empty string', function () {
      const ingredient = new Ingredient({
        type: '',
        amount: 1,
        comment: 'Pilko pieneksi ',
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
    });
    it('should not allow undefined string', function () {
      const ingredient = new Ingredient({
        type: undefined,
        amount: 1,
        comment: 'Pilko pieneksi ',
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
    });
  });
  describe('amount', function () {
    it('should be a number', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 'one',
        comment: 'Pilko pieneksi ',
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
      const ingredient2 = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: [1, 2],
        comment: 'Pilko pieneksi ',
      });
      const err2 = ingredient2.validateSync();
      expect(err2).to.exist;
      const ingredient3 = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 1,
        comment: 'Pilko pieneksi ',
      });
      const err3 = ingredient3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        comment: 'Pilko pieneksi ',
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 0.01', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 0.001,
        comment: 'Pilko pieneksi ',
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
      const ingredient2 = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: -1,
        comment: 'Pilko pieneksi ',
      });
      const err2 = ingredient2.validateSync();
      expect(err2).to.exist;
      const ingredient3 = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 0.01,
        comment: 'Pilko pieneksi ',
      });
      const err3 = ingredient3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should not be over 100', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 101,
        comment: 'Pilko pieneksi ',
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
      const ingredient2 = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 20,
        comment: 'Pilko pieneksi ',
      });
      const err2 = ingredient2.validateSync();
      expect(err2).to.not.exist;
    });
  });
  describe('comment', function () {
    it('should be a string', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 10,
        comment: { comment: 'kommentti' },
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
      const ingredient2 = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 20,
        comment: ['array'],
      });
      const err2 = ingredient2.validateSync();
      expect(err2).to.exist;
      const ingredient3 = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 20,
        comment: 'string',
      });
      const err3 = ingredient3.validateSync();
      expect(err3).to.not.exist;
    });
    it('is not mandatory', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 10,
      });
      const err = ingredient.validateSync();
      expect(err).to.not.exist;
    });
    it('should be at least 1 character long', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 101,
        comment: '',
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 2000 characters long', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 101,
        comment: 'a'.repeat(2001),
      });
      const err = ingredient.validateSync();
      expect(err).to.exist;
    });
    it('should trim comments', function () {
      const ingredient = new Ingredient({
        type: validIngredientType._id.toString(),
        amount: 101,
        comment: '   string',
      });
      expect(ingredient.comment).to.equal('string');
    });
  });
});
