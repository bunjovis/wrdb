const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommentSchema', commentSchema);
