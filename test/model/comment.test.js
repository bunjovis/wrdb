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

  it('should not allow empty string', function () {
    const comment = new Comment({ text: '' });
    const err = comment.validateSync();
    expect(err).to.exist;
  });

  it('should not allow undefined string', function () {
    const comment = new Comment({ text: undefined });
    const err = comment.validateSync();
    expect(err).to.exist;
  });

  it('should be String type', function () {
    const comment = new Comment({ text: [1, 'asd'] });
    const err = comment.validateSync();
    expect(err).to.exist;
  });

  it('should not allow 2001 characters in a comment', function () {
    const tooLongString = 'a'.repeat(2001);
    const comment = new Comment({ text: tooLongString });
    const err = comment.validateSync();
    expect(err).to.exist;
  });

  it('should allow 2000 characters in a comment', function () {
    const longString = 'a'.repeat(2000);
    const comment = new Comment({ text: longString });
    const err = comment.validateSync();
    expect(err).to.not.exist;
  });

  it('should trim comments', function () {
    const trimmableString = '   sana toinen   ';
    const comment = new Comment({ text: trimmableString });
    expect(comment.text).to.equal('sana toinen');
  });

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
