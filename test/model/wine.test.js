/* eslint-disable no-unused-expressions */
const chai = require('chai');
const Comment = require('../../server/models/Comment').model;
const Ingredient = require('../../server/models/Ingredient').model;
const IngredientType = require('../../server/models/IngredientType').model;
const Wine = require('../../server/models/Wine');
const db = require('../../server/db');

const { expect } = chai;

const comment = new Comment({ text: 'Marjat keitetty mehuksi. ' });
const ingredientType = new IngredientType({
  name: 'Mustikka',
  unit: 'kg',
  price: 7.99,
});
const ingredient = new Ingredient({
  type: ingredientType._id.toString(),
  amount: 1,
  comment: 'Pilko pieneksi',
});
let validWine;

describe('Wine Model', function () {
  this.beforeAll((done) => {
    // Open MongoDB connection
    const dbConfig = {
      host: 'localhost',
      port: '27017',
      db: 'winedb',
    };
    db.connect(dbConfig);
    done();
  });

  this.afterAll(() => {
    db.disconnect();
  });

  beforeEach(() => {
    validWine = {
      name: 'Puolukka-peruna',
      ingredients: [ingredient],
      totalCost: 7.99,
      startingGravity: 1100,
      finalGravity: 1000,
      startingVolume: 30,
      finalVolume: 27,
      alcoholContent: 13.3,
      bottlingDate: Date.now(),
      comments: [comment],
      labelId: 'peruna-101020',
    };
  });
  describe('name', function () {
    it('should be a string', function () {
      validWine.name = ['Nimi'];
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.name = { name: 'nimi' };
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.name = 'Sipuli-Porkkana';
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      delete validWine.name;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 1 character long', function () {
      validWine.name = '';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 200 characters long', function () {
      validWine.name = 'a'.repeat(201);
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should trim name', function () {
      validWine.name = '     Lanttu-Ananas';
      const wine = new Wine(validWine);
      expect(wine.name).to.equal('Lanttu-Ananas');
    });
  });
  describe('ingredients', function () {
    it('should be an array of Ingredients', function () {
      validWine.ingredients = ['perunaa', 'sokeria', 'hiivaa'];
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.ingredients = [ingredient];
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.not.exist;
    });
    it('should exist', function () {
      delete validWine.ingredients;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
  });
  describe('totalCost', function () {
    it('should be a number', function () {
      validWine.totalCost = 'tonnin seteli';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.totalCost = { price: 1.44 };
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.totalCost = 20.0;
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      delete validWine.totalCost;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should be atleast 0', function () {
      validWine.totalCost = -1;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 200', function () {
      validWine.totalCost = 201;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
  });
  describe('startingGravity', function () {
    it('should be a number', function () {
      validWine.startingGravity = 'tuhat sata';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.startingGravity = { sg: 1200 };
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.startingGravity = 1100;
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      delete validWine.startingGravity;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should be atleast 1000', function () {
      validWine.startingGravity = 900;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 1200', function () {
      validWine.startingGravity = 1201;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
  });
  describe('finalGravity', function () {
    it('should be a number', function () {
      validWine.finalGravity = 'tuhat sata';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.finalGravity = { sg: 1200 };
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.finalGravity = 1100;
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('is not mandatory', function () {
      delete validWine.finalGravity;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.not.exist;
    });
    it('should be atleast 990', function () {
      validWine.finalGravity = 900;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 1200', function () {
      validWine.finalGravity = 1201;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
  });
  describe('startingVolume', function () {
    it('should be a number', function () {
      validWine.startingVolume = 'kolmekymmentä litraa';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.startingVolume = { startingVolume: 25 };
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.startingVolume = 25;
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      delete validWine.startingVolume;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should be atleast 0', function () {
      validWine.startingVolume = -1;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 30', function () {
      validWine.startingVolume = 31;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
  });
  describe('finalVolume', function () {
    it('should be a number', function () {
      validWine.finalVolume = 'kolmekymmentä litraa';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.finalVolume = { finalVolume: 25 };
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.finalVolume = 25;
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('is not mandatory', function () {
      delete validWine.finalVolume;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.not.exist;
    });
    it('should be atleast 0', function () {
      validWine.finalVolume = -1;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 30', function () {
      validWine.finalVolume = 31;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
  });
  describe('alcoholContent', function () {
    it('should be a number', function () {
      validWine.alcoholContent = '20 prosenttia';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.alcoholContent = { alcoholContent: 20 };
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.alcoholContent = 20;
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('is not mandatory', function () {
      delete validWine.alcoholContent;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.not.exist;
    });
    it('should be atleast 0', function () {
      validWine.alcoholContent = -1;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 20', function () {
      validWine.alcoholContent = 21;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
  });
  describe('bottlingDate', function () {
    it('should be a Date', function () {
      validWine.bottlingDate = 'tänään';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('is not mandatory', function () {
      delete validWine.bottlingDate;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.not.exist;
    });
  });
  describe('comments', function () {
    it('should be an array of Comments', function () {
      validWine.comments = { comment };
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.comments = ['Hyvää tuli', 'Lisää tätä!'];
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.comments = [comment];
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('is not mandatory', function () {
      delete validWine.comments;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.not.exist;
    });
  });
  describe('labelId', function () {
    it('should be a string', function () {
      validWine.labelId = { id: '123123' };
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
      validWine.labelId = ['1234', 'asd1234'];
      const wine2 = new Wine(validWine);
      const err2 = wine2.validateSync();
      expect(err2).to.exist;
      validWine.labelId = 'asd.12342314';
      const wine3 = new Wine(validWine);
      const err3 = wine3.validateSync();
      expect(err3).to.not.exist;
    });
    it('is not mandatory', function () {
      delete validWine.labelId;
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.not.exist;
    });
    it('should be at least 1 character long', function () {
      validWine.labelId = '';
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 50 characters long', function () {
      validWine.labelId = '2'.repeat(51);
      const wine = new Wine(validWine);
      const err = wine.validateSync();
      expect(err).to.exist;
    });
    it('should trim labelId', function () {
      validWine.labelId = '      asd123';
      const wine = new Wine(validWine);
      expect(wine.labelId).to.equal('asd123');
    });
  });
  describe('timestamps', function () {
    it('should timestamp a saved Wine', function (done) {
      const wine = new Wine(validWine);
      wine.save((err, doc) => {
        if (err) {
          done(err);
        } else {
          expect(wine.createdAt).to.exist;
          Wine.findByIdAndDelete(doc._id.toString(), (err2, doc2) => {
            if (err) {
              done(err);
            } else {
              done();
            }
          });
        }
      });
    });
  });
});
