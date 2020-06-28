const mongoose = require('mongoose');
const IngredientType = require('./IngredientType');

const ingredientSchema = mongoose.Schema({
  type: {
    type: IngredientType,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
