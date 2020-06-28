const mongoose = require('mongoose');
const Ingredient = require('./Ingredient.js');
const Comment = require('./Comment.js');

const wineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    ingredients: {
      type: [Ingredient],
    },
    startingGravity: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
    },
    finalGravity: {
      type: Number,
      min: 0,
      max: 2,
    },
    startingVolume: {
      type: Number,
      min: 0,
      max: 30,
    },
    finalVolume: {
      type: Number,
      min: 0,
      max: 30,
    },
    alcoholContent: {
      type: Number,
      min: 0,
      max: 25,
    },
    bottlingDate: {
      type: Date,
    },
    comments: {
      type: [Comment],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wine', wineSchema);
