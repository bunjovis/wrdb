/* eslint-disable no-unused-expressions */
const chai = require('chai');
const Ingredient = require('../../server/models/Ingredient');
const IngredientType = require('../../server/models/IngredientType').model;
const db = require('../../server/db');

const { expect } = chai;

describe('IngredientType Model', function () {
  describe('name', function () {
    it('should be a string', function () {
      const ingredientType = new IngredientType({
        name: { object: 'string' },
        unit: 'kpl',
        price: 1.0,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
      const ingredientType2 = new IngredientType({
        name: ['string'],
        unit: 'kpl',
        price: 1.0,
      });
      const err2 = ingredientType2.validateSync();
      expect(err2).to.exist;
      const ingredientType3 = new IngredientType({
        name: 'Päärynä',
        unit: 'kg',
        price: 1.0,
      });
      const err3 = ingredientType3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const ingredientType = new IngredientType({
        unit: 'kpl',
        price: 1.0,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 1 character long', function () {
      const ingredientType = new IngredientType({
        name: '',
        unit: 'kpl',
        price: 1.0,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 100 characters long', function () {
      const ingredientType = new IngredientType({
        name: 'a'.repeat(101),
        unit: 'kpl',
        price: 1.0,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
    it('should trim name', function () {
      const ingredientType = new IngredientType({
        name: '   Porkkana',
        unit: 'kpl',
        price: 1.0,
      });
      expect(ingredientType.name).to.equal('Porkkana');
    });
  });
  describe('unit', function () {
    it('should be a string', function () {
      const ingredientType = new IngredientType({
        name: 'Mansikka',
        unit: { text: 'kg' },
        price: 7.0,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
      const ingredientType2 = new IngredientType({
        name: 'Mansikka',
        unit: ['kg'],
        price: 7.0,
      });
      const err2 = ingredientType2.validateSync();
      expect(err2).to.exist;
      const ingredientType3 = new IngredientType({
        name: 'Mansikka',
        unit: 'kg',
        price: 7.0,
      });
      const err3 = ingredientType3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const ingredientType = new IngredientType({
        name: 'Mansikka',
        price: 7.0,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 1 character long', function () {
      const ingredientType = new IngredientType({
        name: 'Peruna',
        unit: '',
        price: 7.0,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 26 characters long', function () {
      const ingredientType = new IngredientType({
        name: 'Mansikka',
        unit: 'a'.repeat(26),
        price: 7.0,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
    it('should trim unit', function () {
      const ingredientType = new IngredientType({
        name: 'Mansikka',
        unit: '     tl',
        price: 7.0,
      });
      expect(ingredientType.unit).to.equal('tl');
    });
  });
  describe('price', function () {
    it('should be a number', function () {
      const ingredientType = new IngredientType({
        name: 'Mansikka',
        unit: 'kg',
        price: 'kolme',
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
      const ingredientType2 = new IngredientType({
        name: 'Mansikka',
        unit: 'kg',
        price: [1],
      });
      const err2 = ingredientType2.validateSync();
      expect(err2).to.exist;
      const ingredientType3 = new IngredientType({
        name: 'Mansikka',
        unit: 'kg',
        price: 1.5,
      });
      const err3 = ingredientType3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const ingredientType = new IngredientType({
        name: 'Mansikka',
        unit: 'kg',
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 0.01', function () {
      const ingredientType = new IngredientType({
        name: 'Mansikka',
        unit: 'kg',
        price: 0.0001,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 1000', function () {
      const ingredientType = new IngredientType({
        name: 'Mansikka',
        unit: 'kg',
        price: 1001,
      });
      const err = ingredientType.validateSync();
      expect(err).to.exist;
    });
  });
});
