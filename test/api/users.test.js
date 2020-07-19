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
let api;
let user;
let userToken;
let adminToken;

describe('/api/users', function () {
  this.beforeAll(async function () {
    // Create normal user for tests
    user = new User({
      name: 'Normal user',
      email: 'user@normal.fi',
      password: 'suolapähkinä',
      role: UserRole.USER,
    });
    user.save();
    // Wait for setup script to create admin user
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
  this.afterAll((done) => {
    User.deleteOne({ email: 'user@normal.fi' }, (err) => {
      if (err) {
        console.log(err);
      }
    });
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
            adminToken = json.token;
          });
        });
      fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: 'suolapähkinä',
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          jwt.verify(json.token, process.env.SECRET, function (err, decoded) {
            expect(err).to.not.exist;
            userToken = json.token;
          });
        });
    });
  });
  describe('GET /', function () {
    it('should require admin role', function () {
      fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
      fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      }).then((res) => {
        expect(res.status).to.equal(200);
      });
    });
    it('should return a list of users', function () {
      fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.users.length).to.be.greaterThan(0);
        });
    });
  });
  describe('POST /', function () {
    let newUser;
    let newUser2;
    beforeEach((done) => {
      newUser = {
        name: 'Erkki',
        email: 'erkki@erkkinen.fi',
        password: 'salasana',
        role: UserRole.USER,
      };
      newUser2 = {
        name: 'Erkki',
        email: 'erkki@erkkila.fi',
        password: 'salasana',
        role: UserRole.USER,
      };
      done();
    });
    afterEach((done) => {
      User.findOneAndDelete({ email: newUser.email }, (err, res) => {
        User.findOneAndDelete({ email: newUser2.email }, (err, res) => {
          done();
        });
      });
    });
    it('should require admin role', function () {
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(401);
      });
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(201);
      });
    });
    it('should require a valid name', function () {
      newUser.name = { name: 'name' };
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newUser.name = ['name'];
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newUser.name = 'Erkki';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(201);
      });
      delete newUser2.name;
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser2),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid email', function () {
      newUser.email = 'erkki.fi.fi';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newUser.email = 'erkki@';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newUser.email = 'erkki@erkki';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newUser.email = 'erkki@erkkinen.fi';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(201);
      });
      delete newUser2.email;
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser2),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a unique email', function () {
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(201);
      });
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid password', function () {
      newUser.password = '';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      delete newUser2.password;
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser2),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid role', function () {
      newUser.role = 'admin';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      newUser.role = UserRole.USER;
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      }).then((res) => {
        expect(res.status).to.equal(201);
      });
      delete newUser2.role;
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser2),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should escape HTML from name', function () {
      newUser.name = '<script>killEveryone();</script>';
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.user.name).to.not.equal(newUser.name);
        });
    });
    it('should return the created user', function () {
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.user.name).to.equal(newUser.name);
          expect(json.user.email).to.equal(newUser.email);
          expect(json.user.role).to.equal(newUser.role);
        });
    });
  });
  describe('GET /:id', function () {
    let newUser;
    beforeEach((done) => {
      newUser = {
        name: 'Erkki',
        email: 'erkki@erkkinen2.fi',
        password: 'salasana',
        role: UserRole.USER,
      };
      done();
    });
    afterEach((done) => {
      User.findOneAndDelete({ email: newUser.email }, (err, res) => {
        done();
      });
    });
    it('should require admin role or :id to be requesters id', function (done) {
      fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          fetch('http://localhost:3000/api/users/' + json.user._id, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + userToken,
            },
          }).then((response) => {
            expect(response.status).to.equal(401);
            fetch('http://localhost:3000/api/users/' + json.user._id, {
              method: 'GET',
              headers: {
                Authorization: 'Bearer ' + adminToken,
              },
            }).then((response2) => {
              expect(response2.status).to.equal(200);
              fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: newUser.email,
                  password: newUser.password,
                }),
              })
                .then((res2) => {
                  return res2.json();
                })
                .then((json2) => {
                  fetch('http://localhost:3000/api/users/' + json.user._id, {
                    method: 'GET',
                    headers: {
                      Authorization: 'Bearer ' + json2.token,
                    },
                  }).then((res3) => {
                    expect(res3.status).to.equal(200);
                    done();
                  });
                });
            });
          });
        });
    });
    it('should reply with message "Error occured" to invalid id', function () {
      fetch('http://localhost:3000/api/users/' + 123, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.message).to.equal('Error occured');
        });
    });
    it('should reply with message "User not found" when there is no user with a valid id', function () {
      fetch('http://localhost:3000/api/users/' + '111111111111111111111111', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.message).to.equal('User not found');
        });
    });
    it('should return correct user information', function () {
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.user.name).to.equal(user.name);
          expect(json.user.email).to.equal(user.email);
          expect(json.user.password).to.equal(user.password);
          expect(json.user.role).to.equal(user.role);
        });
    });
  });
  describe('PUT /:id', function () {
    let newUser;
    let newUser2;
    beforeEach((done) => {
      newUser = {
        name: 'Erkki',
        email: 'erkki@erkkinen.fi',
        password: 'salasana',
        role: UserRole.USER,
      };
      newUser2 = {
        name: 'Erkki',
        email: 'erkki@erkkila.fi',
        password: 'salasana',
        role: UserRole.USER,
      };
      done();
    });
    afterEach((done) => {
      User.findOneAndDelete({ email: newUser.email }, (err, res) => {
        User.findOneAndDelete({ email: newUser2.email }, (err, res) => {
          done();
        });
      });
    });
    it('should require admin role or :id to be requesters id', function () {
      fetch('http://localhost:3000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          fetch('http://localhost:3000/api/users/' + json.user._id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + userToken,
            },
            body: JSON.stringify({ name: 'TESTI' }),
          }).then((res2) => {
            expect(res2.status).to.equal(401);
            fetch('http://localhost:3000/api/users/' + user._id, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + adminToken,
              },
              body: JSON.stringify({ name: 'TESTI' }),
            })
              .then((res3) => {
                expect(res3.status).to.equal(200);
                return res3.json();
              })
              .then((json3) => {
                expect(json3.user.name).to.equal('TESTI');
                fetch('http://localhost:3000/api/users/' + user._id, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + userToken,
                  },
                  body: JSON.stringify({ name: 'TESTI2' }),
                })
                  .then((res4) => {
                    expect(res4.status).to.equal(200);
                    return res4.json();
                  })
                  .then((json4) => {
                    expect(json4.user.name).to.equal('TESTI2');
                  });
              });
          });
        });
    });
    it('should require a valid name', function () {
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ name: '' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });

      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ name: ' ' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });

      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ name: ['asd'] }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid email', function () {
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ email: ['asd@asd.fi'] }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ email: 'asd' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ email: 'asd@' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ email: 'kari.fi' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ name: 'qwe@asd.org' }),
      }).then((res) => {
        expect(res.status).to.equal(200);
      });
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ name: 'erkki@erkkinen.fi' }),
      }).then((res) => {
        expect(res.status).to.equal(200);
      });
    });
    it('should require a unique email', function () {
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ email: process.env.ADMIN_EMAIL }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
    it('should require a valid password', function () {
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ password: ['asd'] }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ password: '' }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });

      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ password: 'uusisalasana' }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.user.password).to.not.equal(user.password);
        });
    });
    it('should require a valid role', function () {
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ role: ['admin'] }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ role: 5 }),
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ role: UserRole.USER }),
      }).then((res) => {
        expect(res.status).to.equal(200);
      });
    });
    it('should escape HTML from name', function () {
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ name: '<script>getVirus();</script>' }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.user.name).to.not.equal('<script>getVirus();</script>');
        });
    });
    it('should return the updated user', function () {
      fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({ name: 'uusinimi' }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.user.name).to.equal('uusinimi');
        });
    });
    it('should reply with message "Error occured" to invalid id', function () {
      fetch('http://localhost:3000/api/users/' + 123, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify({ name: 'test' }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          expect(json.message).to.equal('Error occured');
        });
    });
  });
  describe('DELETE /:id', function () {
    let newUser;
    let newUser2;
    beforeEach((done) => {
      newUser = {
        name: 'Erkki',
        email: 'erkki@erkkinen.fi',
        password: 'salasana',
        role: UserRole.USER,
      };
      newUser2 = {
        name: 'Erkki',
        email: 'erkki@erkkila.fi',
        password: 'salasana',
        role: UserRole.USER,
      };
      done();
    });
    afterEach((done) => {
      User.findOneAndDelete({ email: newUser.email }, (err, res) => {
        User.findOneAndDelete({ email: newUser2.email }, (err, res) => {
          done();
        });
      });
    });
    it('should require admin role or :id to be requesters id', function () {
      fetch('http://localhost:3000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          fetch('http://localhost:3000/api/users/' + json.user._id, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + userToken,
            },
          }).then((res2) => {
            expect(res2.status).to.equal(401);
            fetch('http://localhost:3000/api/users/' + json.user._id, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + adminToken,
              },
            }).then((res3) => {
              expect(res3.status).to.equal(200);
              fetch('http://localhost:3000/api/users/' + user._id, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + userToken,
                },
              }).then((res4) => {
                expect(res4.status).to.equal(200);
              });
            });
          });
        });
    });
    it('should reply with message "User not found" to invalid id', function () {
      fetch('http://localhost:3000/api/users/' + 123, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
      }).then((res) => {
        expect(res.status).to.equal(500);
      });
    });
  });
});
