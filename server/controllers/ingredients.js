const Ingredient = require('../models/Ingredient');
const IngredientType = require('../models/IngredientType');

const listIngredients = (req, res) => {
  Ingredient.find((err, res) => {
    return res.status(200).json({ ingredients: res });
  });
};
const addIngredient = (req, res) => {};
const showIngredient = (req, res) => {};
const editIngredient = (req, res) => {};
const deleteIngredient = (req, res) => {};

module.exports = {
  listIngredients,
  addIngredient,
  showIngredient,
  editIngredient,
  deleteIngredient,
};
