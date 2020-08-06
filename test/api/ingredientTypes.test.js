/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
require('../../server/app');
const IngredientType = require('../../server/models/IngredientType').model;
require('dotenv').config();

const { expect } = chai;
let adminToken;
let peruna;

describe('/api/ingredienttypes', function () {
  this.beforeAll(async function () {
    peruna = new IngredientType({
      name: 'Peruna',
      unit: 'kg',
      price: 0.5,
    });
    peruna.save();
    // Wait for setup script to create admin user and save peruna
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
    IngredientType.deleteOne({ id: peruna._id }, (err) => {
      if (err) {
        console.log(err);
      }
    });
    done();
  });
  describe('GET /', function () {
    it('should require login', function () {
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'GET',
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should return a list of ingredient types', function () {
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.ingredientTypes.length).to.be.greaterThan(0);
        });
    });
  });
  describe('POST /', function () {
    let newIngredientType;
    beforeEach(function (done) {
      newIngredientType = {
        name: 'Tomaatti',
        unit: 'kg',
        price: 2.0,
      };
      done();
    });
    it('should require login', function () {
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should require a valid name', function () {
      newIngredientType.name = '';
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newIngredientType.name = { name: 'asd' };
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete newIngredientType.name;
      newIngredientType.name = '';
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid unit', function () {
      newIngredientType.unit = '';
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newIngredientType.unit = { type: 'kg' };
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete newIngredientType.unit;
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid price', function () {
      newIngredientType.price = '30,5';
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newIngredientType.price = { price: 3.0 };
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete newIngredientType.price;
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should escape HTML from name', function () {
      newIngredientType.name = '<script>hackhack();</script>';
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.ingredientType.name).to.not.equal(newIngredientType.name);
          IngredientType.findByIdAndDelete(
            json.ingredientType._id,
            (err, res2) => {}
          );
        });
    });
    it('should escape HTML from unit', function () {
      newIngredientType.unit = '<script>hack();</script>';
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.ingredientType.unit).to.not.equal(newIngredientType.unit);
          IngredientType.findByIdAndDelete(
            json.ingredientType._id,
            (err, res2) => {}
          );
        });
    });
    it('should return the created ingredient type', function () {
      fetch('http://localhost:3000/api/ingredienttypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredientType),
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.ingredientType.name).to.equal(newIngredientType.name);
          expect(json.ingredientType.unit).to.equal(newIngredientType.unit);
          expect(json.ingredientType.price).to.equal(newIngredientType.price);
          IngredientType.findByIdAndDelete(
            json.ingredientType._id,
            (err, res2) => {}
          );
        });
    });
  });
  describe('GET /:id', function () {
    it('should require login', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'GET',
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should reply with message "Error occured" to invalid id', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${123}`, {
        method: 'GET',
        headers: {
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
    it('should reply with message "Error occured" when there is no ingredient type with a valid id', function () {
      fetch(
        `http://localhost:3000/api/ingredienttypes/${111111111111111111111111}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      )
        .then((res) => {
          expect(res.status).to.equal(500);
          return res.json();
        })
        .then((json) => {
          expect(json.message).to.equal('Error occured');
        });
    });
    it('should return correct ingredient type', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredientType.name).to.equal(peruna.name);
          expect(json.ingredientType.unit).to.equal(peruna.unit);
          expect(json.ingredientType.price).to.equal(peruna.price);
        });
    });
  });
  describe('PUT /:id', function () {
    it('should require login', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unit: 'litra' }),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should require a valid name', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: '' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: ['dfg'] }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: { name: 'asdadsd' } }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid unit', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ unit: '' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ unit: ['dfg'] }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ unit: { name: 'asdadsd' } }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid price', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ price: 'kolme euroa' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ price: -10 }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ price: { price: 5.4 } }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should escape HTML from name', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: '<script>stealCreditcards();</script>' }),
      })
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredientType.name).to.not.equal(
            '<script>stealCreditcards()</script>'
          );
        });
    });
    it('should escape HTML from unit', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ unit: '<sc>x();</sc>' }),
      })
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredientType.unit).to.not.equal('<sc>x</sc>');
        });
    });
    it('should return the updated ingredient type', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: 'Mustaherukka' }),
      })
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredientType.name).to.equal('Mustaherukka');
        });
    });
    it('should reply with message "Error occured" to invalid id', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${6351}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: 'Mustaherukka' }),
      })
        .then((res) => {
          expect(res.status).to.equal(500);
          return res.json();
        })
        .then((json) => {
          expect(json.message).to.equal('Error occured');
        });
    });
  });
  describe('DELETE /:id', function () {
    it('should require login', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should reply with message "Ingredient type not found" to invalid id', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${123}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should return the deleted ingredient type', function () {
      fetch(`http://localhost:3000/api/ingredienttypes/${peruna._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredientType._id).to.equal(peruna._id.toString());
        });
    });
  });
});
