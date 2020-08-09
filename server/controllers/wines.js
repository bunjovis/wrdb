const Wine = require('../models/Wine');

const listWines = (req, res) => {
  Wine.find((err, res2) => res.status(200).json({ wines: res2 }));
};
const addWine = (req, res) => {
  const {
    name,
    ingredients,
    totalCost,
    startingGravity,
    finalGravity,
    startingVolume,
    finalVolume,
    alcoholContent,
    bottlingDate,
    comments,
    labelId,
  } = req.body;
  const newWine = {
    name,
    ingredients,
    totalCost,
    startingGravity,
    startingVolume,
  };
  if (finalGravity) {
    newWine.finalGravity = finalGravity;
  }
  if (finalVolume) {
    newWine.finalVolume = finalVolume;
  }
  if (alcoholContent) {
    newWine.alcoholContent = alcoholContent;
  }
  if (bottlingDate) {
    newWine.bottlingDate = bottlingDate;
  }
  if (comments) {
    newWine.comments = comments;
  }
  if (labelId) {
    newWine.labelId = labelId;
  }
  const wine = new Wine(newWine);
  wine.save((err, doc) => {
    if (err || !doc) {
      return res.status(500).json({ message: 'Error occured', error: err });
    } else {
      return res.status(201).json({ message: 'New wine created', wine: doc });
    }
  });
};
const showWine = (req, res) => {
  const { id } = req.params;
  Wine.findOne({ _id: id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (!doc) {
      return res.status(500).json({ message: 'Wine not found' });
    }

    return res.status(200).json({ wine: doc });
  });
};
const editWine = (req, res) => {
  const { id } = req.params;
  const {
    name,
    ingredients,
    totalCost,
    startingGravity,
    finalGravity,
    startingVolume,
    finalVolume,
    alcoholContent,
    bottlingDate,
    comments,
    labelId,
  } = req.body;
  Wine.findById(id, (err, doc) => {
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (!doc) {
      return res.status(500).json({ message: 'Wine not found' });
    }
    if (name && name !== '') {
      doc.name = name;
    }
    if (name == '' || name == ' ') {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (ingredients) {
      if (Array.isArray(ingredients)) {
        doc.ingredients = ingredients;
      } else {
        return res.status(500).json({ message: 'Error occured', error: err });
      }
    }
    if (totalCost == '') {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (totalCost) {
      if (isNaN(totalCost)) {
        return res.status(500).json({ message: 'Error occured', error: err });
      } else {
        doc.totalCost = totalCost;
      }
    }
    if (startingGravity == '') {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (startingGravity) {
      doc.startingGravity = startingGravity;
    }
    if (finalGravity) {
      doc.finalGravity = finalGravity;
    }
    if (startingVolume == '') {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    if (startingVolume) {
      doc.startingVolume = startingVolume;
    }
    if (finalVolume) {
      doc.finalVolume = finalVolume;
    }
    if (alcoholContent) {
      doc.alcoholContent = alcoholContent;
    }
    if (bottlingDate) {
      doc.bottlingDate = bottlingDate;
    }
    if (comments) {
      doc.comments = comments;
    }
    if (labelId) {
      doc.labelId = labelId;
    }
    doc.save({ runValidators: true }, (err2, doc2) => {
      if (err2) {
        return res.status(500).json({ message: 'Error occured', error: err2 });
      }
      return res.status(200).json({ wine: doc2 });
    });
  });
};
const deleteWine = (req, res) => {
  const { id } = req.params;
  Wine.findByIdAndRemove(id, (err, doc) => {
    if (!doc) {
      return res.status(500).json({ message: 'Wine not found' });
    }
    if (err) {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
    return res.status(200).json({ wine: doc });
  });
};

module.exports = {
  listWines,
  addWine,
  showWine,
  editWine,
  deleteWine,
};
