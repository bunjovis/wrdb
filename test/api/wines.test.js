/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const IngredientType = require('../../server/models/IngredientType').model;
const Ingredient = require('../../server/models/Ingredient').model;
const Wine = require('../../server/models/Wine');
require('../../server/app');
require('dotenv').config();

const { expect } = chai;
let adminToken;
let kiloperunaa;
let peruna;
let perunaviini;

describe('/api/wines', function () {
  this.beforeAll(async function () {
    peruna = new IngredientType({
      name: 'Peruna',
      unit: 'kg',
      price: 0.5,
    });
    peruna.save((err, prod) => {
      kiloperunaa = new Ingredient({
        type: prod._id.toString(),
        amount: 1.0,
        comment:
          'Murskaa peruna oikein hienoksi, että saat varmasti kaiken hyvän perunanmaun viiniin',
      });
      kiloperunaa.save((err2, prod2) => {
        perunaviini = new Wine({
          name: 'Perunaviini',
          ingredients: [kiloperunaa],
          totalCost: peruna.price * kiloperunaa.amount,
          startingGravity: 1090,
          startingVolume: 25,
        });
        perunaviini.save();
      });
    });
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
      .then((res) => res.json())
      .then((json) => {
        jwt.verify(json.token, process.env.SECRET, function (err, decoded) {
          expect(err).to.not.exist;
          adminToken = json.token;
        });
      });
  });
  this.afterAll(function (done) {
    Wine.deleteOne({ _id: perunaviini._id }, () => {
      Ingredient.deleteOne({ _id: kiloperunaa._id }, () => {
        IngredientType.deleteOne({ _id: peruna._id }, () => {
          done();
        });
      });
    });
  });
  describe('GET /', function () {
    it('should require login', function () {
      fetch('http://localhost:3000/api/wines', {
        method: 'GET',
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should return a list of wines', function () {
      fetch('http://localhost:3000/api/wines', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.wines.length).to.be.greaterThan(0);
        });
    });
  });
  describe('POST /', function () {
    let perunaviina;
    beforeEach(function () {
      perunaviina = {
        name: 'Perunaviina',
        ingredients: [kiloperunaa],
        totalCost: peruna.price * kiloperunaa.amount,
        startingGravity: 1090,
        startingVolume: 25,
      };
    });
    afterEach(function (done) {
      Wine.deleteOne({ name: 'Perunaviina' }, function () {
        done();
      });
    });
    it('should require login', function () {
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should require a valid name', function () {
      perunaviina.name = '';
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      perunaviina.name = { nimi: 'Perunaviina' };
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete perunaviina.name;
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require at least one valid ingredient', function () {
      perunaviina.ingredients = ['peruna'];
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      perunaviina.ingredients = [];
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete perunaviina.ingredients;
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid totalCost', function () {
      perunaviina.totalCost = { cost: 100 };
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      perunaviina.totalCost = [10, 143, 20];
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete perunaviina.totalCost;
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid startingGravity', function () {
      perunaviina.startingGravity = 800;
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      perunaviina.startingGravity = { grav: 1000 };
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete perunaviina.startingGravity;
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid startingVolume', function () {
      perunaviina.startingVolume = -1;
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      perunaviina.startingVolume = { volume: 20 };
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete perunaviina.startingVolume;
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should escape HTML from name', function () {
      perunaviina.name = '<script>destroyDB();</script>';
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.wine.name).to.not.equal(perunaviina.name);
        });
    });
    it('should return the created wine', function () {
      fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(perunaviina),
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.wine.name).to.equal(perunaviina.name);
          expect(json.wine.totalCost).to.equal(perunaviina.totalCost);
          expect(json.wine.startingGravity).to.equal(
            perunaviina.startingGravity
          );
          expect(json.wine.startingVolume).to.equal(perunaviina.startingVolume);
        });
    });
  });
  describe('GET /:id', function () {
    it('should require login', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should reply with message "Error occured" to invalid id', function () {
      fetch('http://localhost:3000/api/wines/asd', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => {
          expect(res.status).to.equal(500);
          return res.json();
        })
        .then((json) => {
          expect(json.message).to.equal('Error occured');
        });
    });
    it('should reply with message "Wine not found" when there is no wine with a valid id', function () {
      fetch('http://localhost:3000/api/wines/111111111111111111111111', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => {
          expect(res.status).to.equal(500);
          return res.json();
        })
        .then((json) => {
          expect(json.message).to.equal('Wine not found');
        });
    });
    it('should return correct wine', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${perunaviini._id.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
        }
      )
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then((json) => {
          expect(json.wine._id).to.equal(perunaviini._id.toString());
          expect(json.wine.name).to.equal(perunaviini.name);
          expect(json.wine.totalCost).to.equal(perunaviini.totalCost);
          expect(json.wine.startingGravity).to.equal(
            perunaviini.startingGravity
          );
          expect(json.wine.startingVolume).to.equal(perunaviini.startingVolume);
        });
    });
  });
  describe('PUT /:id', function () {
    it('should require login', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Tomaattiviini' }),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should require a valid name', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: '' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: { name: '' } }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: ' ' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require at least one valid ingredient', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ingredients: [''] }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ingredients: { ingredient: kiloperunaa } }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid totalCost', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ totalCost: '' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ totalCost: -1 }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ totalCost: { euros: 10 } }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid startingGravity', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ startingGravity: '' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ startingGravity: 500 }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ startingGravity: { gravity: 1200 } }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid startingVolume', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ startingVolume: '' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ startingVolume: 50 }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ startingVolume: { volume: 20 } }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should escape HTML from name', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: '<script>murder();</script>' }),
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.wine.name).to.not.equal('<script>murder();</script>');
        });
    });
    it('should return the updated wine', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: 'VIINI' }),
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.wine._id).to.equal(perunaviini._id.toString());
          expect(json.wine.name).to.equal('VIINI');
          expect(json.wine.totalCost).to.equal(perunaviini.totalCost);
          expect(json.wine.startingGravity).to.equal(
            perunaviini.startingGravity
          );
          expect(json.wine.startingVolume).to.equal(perunaviini.startingVolume);
        });
    });
    it('should reply with message "Error occured" to invalid id', function () {
      fetch('http://localhost:3000/api/wines/asd', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: 'Vääräviini' }),
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.message).to.equal('Error occured');
        });
    });
  });
  describe('DELETE /:id', function () {
    it('should require login', function () {
      fetch(`http://localhost:3000/api/wines/${perunaviini._id.toString()}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should reply with message "Wine not found" to invalid id', function () {
      fetch('http://localhost:3000/api/wines/asd', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.message).to.equal('Wine not found');
        });
    });
  });
});
