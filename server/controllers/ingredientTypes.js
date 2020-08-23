const IngredientType = require('../models/IngredientType').model;

const listIngredientTypes = (req, res) => {
  IngredientType.find(
    (err, res2) => res.status(200).json({ ingredientTypes: res2 }) //eslint-disable-line
  );
};
const addIngredientType = (req, res) => {
  const { name, unit, price } = req.body;
  const ingredientType = new IngredientType({ name, unit, price });
  ingredientType.save((err, doc) => {
    if (err || !doc) {
      return res.status(500).json({ message: 'Error occured', error: err });
    } else {
      return res
        .status(201)
        .json({ message: 'New ingredient type created', ingredientType: doc });
    }
  });
};
const showIngredientType = (req, res) => {
  const { id } = req.params;
  IngredientType.findOne({ _id: id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (!doc) {
      return res.status(500).json({ message: 'Ingredient type not found' });
    }

    return res.status(200).json({ ingredientType: doc });
  });
};
const editIngredientType = (req, res) => {
  const { id } = req.params;
  const { name, unit, price } = req.body;
  IngredientType.findById(id, (err, doc) => {
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (!doc) {
      return res.status(500).json({ message: 'Ingredient type not found' });
    }

    if (name && name !== '') {
      doc.name = name;
    }
    if (name === '' || name === ' ') {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (unit && unit !== '') {
      doc.unit = unit;
    }
    if (unit === '' || unit === ' ') {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (price && Number.isNaN(price)) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (price) {
      doc.price = price;
    }
    doc.save({ runValidators: true }, (err2, doc2) => {
      if (err2) {
        return res.status(500).json({ message: 'Error occured', error: err2 });
      }
      return res.status(200).json({ ingredientType: doc2 });
    });
  });
};
const deleteIngredientType = (req, res) => {
  const { id } = req.params;
  IngredientType.findByIdAndRemove(id, (err, doc) => {
    if (!doc) {
      return res.status(500).json({ message: 'Ingredient type not found' });
    }
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    return res.status(200).json({ ingredientType: doc });
  });
};

module.exports = {
  listIngredientTypes,
  addIngredientType,
  showIngredientType,
  editIngredientType,
  deleteIngredientType,
};
