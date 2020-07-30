const Ingredient = require('../models/Ingredient');

const listIngredients = (req, res) => {
  Ingredient.find((err, res) => {
    return res.status(200).json({ ingredients: res });
  });
};
const addIngredient = (req, res) => {
  const { type, amount, comment } = req.body;
  const ingredient = new Ingredient(type, amount, comment);
  ingredient.save((err, doc) => {
    if (err || !doc) {
      return res.status(500).json({ message: 'Error occured', error: err });
    } else {
      return res
        .status(201)
        .json({ message: 'New ingredient created', ingredient: doc });
    }
  });
};
const showIngredient = (req, res) => {
  const id = req.params.id;
  Ingredient.findOne({ _id: id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (!doc) {
      return res.status(500).json({ message: 'Ingredient not found' });
    }

    return res.status(200).json({ ingredient: doc });
  });
};
const editIngredient = (req, res) => {
  const id = req.params.id;
  const { type, amount, comment } = req.body;
  Ingredient.findById(id, (err, doc) => {
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (!doc) {
      return res.status(500).json({ message: 'Ingredient not found' });
    }

    if (comment && comment !== '') {
      doc.comment = comment;
    }
    if (comment == '' || comment == ' ') {
      return res.status(500).json({ message: 'Error occured', error: err });
    }

    doc.save({ runValidators: true }, (err2, doc2) => {
      if (err2) {
        return res.status(500).json({ message: 'Error occured', error: err2 });
      }
      return res.status(200).json({ ingredient: doc2 });
    });
  });
};
const deleteIngredient = (req, res) => {
  const id = req.params.id;
  Ingredient.findByIdAndRemove(id, (err, doc) => {
    if (!doc) {
      return res.status(500).json({ message: 'Ingredient not found' });
    }
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    return res.status(200).json({ ingredient: doc });
  });
};

module.exports = {
  listIngredients,
  addIngredient,
  showIngredient,
  editIngredient,
  deleteIngredient,
};
