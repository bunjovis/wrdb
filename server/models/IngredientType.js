const mongoose = require('mongoose');

const ingredientTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100,
  },
  unit: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0.01,
    max: 1000,
  },
});

module.exports = {
  model: mongoose.model('IngredientType', ingredientTypeSchema),
  schema: ingredientTypeSchema,
};
