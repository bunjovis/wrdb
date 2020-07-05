const mongoose = require('mongoose');
const Ingredient = require('./Ingredient.js').schema;
const Comment = require('./Comment.js').schema;

const wineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    ingredients: {
      type: [Ingredient],
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    startingGravity: {
      type: Number,
      required: true,
      min: 1000,
      max: 1200,
    },
    finalGravity: {
      type: Number,
      min: 990,
      max: 1200,
    },
    startingVolume: {
      type: Number,
      min: 0,
      max: 30,
      required: true,
    },
    finalVolume: {
      type: Number,
      min: 0,
      max: 30,
    },
    alcoholContent: {
      type: Number,
      min: 0,
      max: 20,
    },
    bottlingDate: {
      type: Date,
    },
    comments: {
      type: [Comment],
    },
    labelId: {
      type: String,
      minlength: 1,
      maxlength: 50,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wine', wineSchema);
