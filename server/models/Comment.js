const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

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
commentSchema.plugin(sanitizerPlugin, {
  include: ['text'],
  mode: 'escape',
});
module.exports = {
  model: mongoose.model('Comment', commentSchema),
  schema: commentSchema,
};
