/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
require('../../server/app');
const IngredientType = require('../../server/models/IngredientType').model;
const Ingredient = require('../../server/models/Ingredient').model;
require('dotenv').config();

const { expect } = chai;
let adminToken;
let kiloperunaa;
let peruna;

describe('/api/ingredients', function () {
  this.beforeAll(async () => {
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
      kiloperunaa.save();
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
        jwt.verify(json.token, process.env.SECRET, (err, decoded) => {
          expect(err).to.not.exist;
          expect(decoded).to.exist;
          adminToken = json.token;
        });
      });
  });
  this.afterAll(function (done) {
    Ingredient.deleteOne({ _id: kiloperunaa._id }, () => {
      IngredientType.deleteOne({ _id: peruna._id }, () => {
        done();
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
          Authorization: `Bearer ${adminToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          expect(json.ingredients.length).to.be.greaterThan(0);
        });
    });
  });
  describe('POST /', function () {
    let newIngredient;
    beforeEach(function () {
      newIngredient = {
        type: peruna._id.toString(),
        amount: 2.0,
        comment: 'Keitä ja kuutioi perunat',
      };
    });
    afterEach(function (done) {
      Ingredient.deleteOne({ type: peruna._id.toString(), amount: 2.0 }, () => {
        done();
      });
    });
    it('should require login', function () {
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should require a valid type', function () {
      newIngredient.type = 'asd';
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newIngredient.type = { type: peruna._id.toString() };
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete newIngredient.type;
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid amount', function () {
      newIngredient.amount = 1000;
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newIngredient.amount = { amount: 50 };
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newIngredient.amount = -1;
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete newIngredient.amount;
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid comment or no comment at all', function () {
      newIngredient.comment = '';
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newIngredient.comment = { comment: 'Kuori perunat eka' };
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete newIngredient.comment;
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      }).then((res) => {
        expect(res.status).to.equal(201);
      });
    });
    it('should escape HTML from comment', function () {
      newIngredient.comment = '<script>hack();</script>';
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      })
        .then((res) => {
          expect(res.status).to.equal(201);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredient.comment).to.not.equal(newIngredient.comment);
        });
    });
    it('should return the created ingredient', function () {
      fetch('http://localhost:3000/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newIngredient),
      })
        .then((res) => {
          expect(res.status).to.equal(201);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredient.type).to.equal(newIngredient.type);
          expect(json.ingredient.amount).to.equal(newIngredient.amount);
          expect(json.ingredient.comment).to.equal(newIngredient.comment);
        });
    });
  });
  describe('GET /:id', function () {
    it('should require login', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should reply with message "Error occured" to invalid id', function () {
      fetch('http://localhost:3000/api/ingredients/asd', {
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
    it('should reply with message "Ingredient not found" when there is no ingredient with a valid id', function () {
      fetch('http://localhost:3000/api/ingredients/111111111111111111111111', {
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
          expect(json.message).to.equal('Ingredient not found');
        });
    });
    it('should return correct ingredient', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
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
          expect(json.ingredient._id).to.equal(kiloperunaa._id.toString());
          expect(json.ingredient.type).to.equal(kiloperunaa.type);
          expect(json.ingredient.amount).to.equal(kiloperunaa.amount);
          expect(json.ingredient.comment).to.equal(kiloperunaa.comment);
        });
    });
  });
  describe('PUT /:id', function () {
    it('should require login', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: 1.4 }),
        }
      ).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should require a valid type', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ type: 1.4 }),
        }
      ).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ type: 'asd' }),
        }
      ).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid amount', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ amount: { a: 1.2 } }),
        }
      ).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid comment', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ comment: '' }),
        }
      ).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should escape HTML from comment', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ comment: '<script>hax();</script>' }),
        }
      )
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredient.comment).to.not.equal(
            '<script>hax();</script>'
          );
        });
    });
    it('should return the updated ingredient', function () {
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ amount: 0.9, comment: 'Raakana' }),
        }
      )
        .then((res) => {
          expect(res.status).to.equal(200);
          return res.json();
        })
        .then((json) => {
          expect(json.ingredient._id).to.equal(kiloperunaa._id.toString());
          expect(json.ingredient.comment).to.equal('Raakana');
          expect(json.ingredient.amount).to.equal(0.9);
        });
    });
    it('should reply with message "Error occured" to invalid id', function () {
      fetch('http://localhost:3000/api/ingredients/asd', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ comment: 'ASD' }),
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
      fetch(
        `http://localhost:3000/api/ingredients/${kiloperunaa._id.toString()}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => {
        expect(res.status).to.equal(401);
      });
    });
    it('should reply with message "Ingredient not found" to invalid id', function () {
      fetch('http://localhost:3000/api/ingredients/asd', {
        method: 'DELETE',
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
          expect(json.message).to.equal('Ingredient not found');
        });
    });
  });
});
