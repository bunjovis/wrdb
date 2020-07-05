const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

module.exports = {
  model: mongoose.model('Comment', commentSchema),
  schema: commentSchema,
};
