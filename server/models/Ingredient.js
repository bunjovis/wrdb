const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const ingredientSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 24,
    trim: true,
    validate: {
      validator(val) {
        return mongoose.Types.ObjectId.isValid(val);
      },
    },
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
    max: 100,
  },
  comment: {
    type: String,
    minlength: 1,
    maxlength: 2000,
    trim: true,
  },
});
ingredientSchema.plugin(sanitizerPlugin, {
  include: ['comment'],
  mode: 'escape',
});
module.exports = {
  model: mongoose.model('Ingredient', ingredientSchema),
  schema: ingredientSchema,
};
