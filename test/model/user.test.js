/* eslint-disable no-unused-expressions */
const chai = require('chai');
const UserRole = require('../../server/models/UserRole');
const User = require('../../server/models/User');
const db = require('../../server/db');

const { expect } = chai;

describe('User Model', function () {
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
  describe('name', function () {
    it('should be a string', function () {
      const user = new User({
        name: ['asd'],
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
      const user2 = new User({
        name: { object: 'nimi' },
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err2 = user2.validateSync();
      expect(err2).to.exist;
      const user3 = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err3 = user3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const user = new User({
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 1 character long', function () {
      const user = new User({
        name: '',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 100 characters long', function () {
      const user = new User({
        name: 'a'.repeat(101),
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
    it('should trim name', function () {
      const user = new User({
        name: '     Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      expect(user.name).to.equal('Erkki');
    });
  });
  describe('email', function () {
    it('should be a string', function () {
      const user = new User({
        name: 'Erkki',
        email: ['erkki.erkkinen@erkki.fi'],
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
      const user2 = new User({
        name: 'Erkki',
        email: { email: 'erkki.erkkinen@erkki.fi' },
        password: 'erkki',
        role: UserRole.USER,
      });
      const err2 = user2.validateSync();
      expect(err2).to.exist;
      const user3 = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err3 = user3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const user = new User({
        name: 'Erkki',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 1 character long', function () {
      const user = new User({
        name: 'Erkki',
        email: '',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 254 characters long', function () {
      const user = new User({
        name: 'Erkki',
        email: 'a'.repeat(250) + '@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
    it('should trim email', function () {
      const user = new User({
        name: 'Erkki',
        email: '      erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      expect(user.email).to.equal('erkki.erkkinen@erkki.fi');
    });
    it('should be a valid email address', function () {
      const user = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen2erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
      const user2 = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err2 = user2.validateSync();
      expect(err2).to.exist;
      const user3 = new User({
        name: 'Erkki',
        email: '@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err3 = user3.validateSync();
      expect(err3).to.exist;
    });
    it('should be unique', function (done) {
      const user = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      user.save((err, doc) => {
        if (err) {
          done(err);
        } else {
          const user2 = new User({
            name: 'Erkki',
            email: 'erkki.erkkinen@erkki.fi',
            password: 'erkki',
            role: UserRole.USER,
          });
          user2.save((err2, doc2) => {
            expect(err2).to.exist;
            User.findByIdAndDelete(user._id.toString(), (err3, res) => {
              if (err3) {
                done(err3);
              } else {
                done();
              }
            });
          });
        }
      });
    });
  });
  describe('password', function () {
    it('should be a string', function () {
      const user = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: ['erkki'],
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
      const user2 = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: { password: 'erkki' },
        role: UserRole.USER,
      });
      const err2 = user2.validateSync();
      expect(err2).to.exist;
      const user3 = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      const err3 = user3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const user = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 1 character long', function () {
      const user = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: '',
        role: UserRole.USER,
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
    it('should hash password', function () {
      const user = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'erkki',
        role: UserRole.USER,
      });
      expect(user.password).to.not.equal('erkki');
    });
  });
  describe('role', function () {
    it('should be UserRole.ADMIN or UserRole.USER', function () {
      const user = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'passwööörd',
        role: 0,
      });
      const err = user.validateSync();
      expect(err).to.exist;
      const user2 = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'passwööörd',
        role: 'admin',
      });
      const err2 = user2.validateSync();
      expect(err2).to.exist;
      const user3 = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'passwööörd',
        role: UserRole.USER,
      });
      const err3 = user3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const user = new User({
        name: 'Erkki',
        email: 'erkki.erkkinen@erkki.fi',
        password: 'passwöörd',
      });
      const err = user.validateSync();
      expect(err).to.exist;
    });
  });
});
