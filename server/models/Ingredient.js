const mongoose = require('mongoose');
const IngredientType = require('./IngredientType').model;

const ingredientSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 24,
    trim: true,
    set: (type) => {
      if (typeof type != 'string') {
        return undefined;
      } else {
        if (mongoose.Types.ObjectId.isValid(type)) {
          return type;
        } else {
          return undefined;
        }
      }
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

module.exports = mongoose.model('Ingredient', ingredientSchema);
