/* eslint-disable no-unused-expressions */
const chai = require('chai');
const Comment = require('../../server/models/Comment');
const db = require('../../server/db');

const { expect } = chai;

describe('Comment Model', function () {
  this.beforeAll(() => {
    // Open MongoDB connection
    const dbConfig = {
      host: 'localhost',
      port: '27017',
      db: 'winedb',
    };
    db.connect(dbConfig);
  });

  this.afterAll(() => {
    db.disconnect();
  });
  describe('text', function () {
    it('should be a string', function () {
      const comment = new Comment({ text: [1, 'asd'] });
      const err = comment.validateSync();
      expect(err).to.exist;
      const comment2 = new Comment({ text: undefined });
      const err2 = comment2.validateSync();
      expect(err2).to.exist;
      const comment3 = new Comment({ text: 'Oikea kommentti' });
      const err3 = comment3.validateSync();
      expect(err3).to.not.exist;
    });
    it('should exist', function () {
      const comment = new Comment({ testi: 'sad' });
      const err = comment.validateSync();
      expect(err).to.exist;
    });
    it('should be at least 1 character long', function () {
      const comment = new Comment({ text: '' });
      const err = comment.validateSync();
      expect(err).to.exist;
    });
    it('should not be over 2000 characters long', function () {
      const tooLongString = 'a'.repeat(2001);
      const comment = new Comment({ text: tooLongString });
      const err = comment.validateSync();
      expect(err).to.exist;
    });
    it('should trim comments', function () {
      const trimmableString = '   sana toinen   ';
      const comment = new Comment({ text: trimmableString });
      expect(comment.text).to.equal('sana toinen');
    });
  });
  describe('timestamp', function () {
    it('should timestamp saved comment', function (done) {
      const validComment = 'Parasta viiniä ikinä!';
      const comment = new Comment({ text: validComment });
      comment.save((err, doc) => {
        if (err) {
          done(err);
        } else {
          expect(doc.createdAt).to.exist;
          expect(doc.updatedAt).to.exist;
          done();
        }
      });
    });
  });
});
