const Wine = require('../models/Wine');
const Ingredient = require('../models/Ingredient').model;
const Comment = require('../models/Comment').model;
const fs = require('fs');

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
  if (ingredients) {
    const newIngredients = [];
    const len = ingredients.length;
    let i = 0;
    ingredients.forEach((ingredient) => {
      const newIngredient = new Ingredient({
        type: ingredient.type,
        amount: ingredient.amount,
        comment: ingredient.comment,
      });
      newIngredient.save((err, prod) => {
        if (err) {
          return res.status(500).json({
            message: 'Error occured',
            error: err,
          });
        } else {
          newIngredients.push(prod);
          i++;
          if (i == len) {
            const newWine = {
              name,
              ingredients: newIngredients,
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
              const newComments = [];
              const len2 = comments.length;
              let j = 0;
              comments.forEach((comment) => {
                const newComment = new Comment({
                  text: comment.text,
                });
                newComment.save((err2, prod2) => {
                  if (err2) {
                    return res.status(500).json({
                      message: 'Error occured',
                      error: err2,
                    });
                  } else {
                    newComments.push(prod2);
                    j++;
                    if (j == len2) {
                      newWine.comments = newComments;
                      if (labelId) {
                        newWine.labelId = labelId;
                      }
                      const wine = new Wine(newWine);
                      wine.save((err3, doc) => {
                        if (err3 || !doc) {
                          return res
                            .status(500)
                            .json({ message: 'Error occured', error: err3 });
                        } else {
                          return res
                            .status(201)
                            .json({ message: 'New wine created', wine: doc });
                        }
                      });
                    }
                  }
                });
              });
            } else {
              if (labelId) {
                newWine.labelId = labelId;
              }
              const wine = new Wine(newWine);
              wine.save((err3, doc) => {
                if (err3 || !doc) {
                  return res
                    .status(500)
                    .json({ message: 'Error occured', error: err3 });
                } else {
                  return res
                    .status(201)
                    .json({ message: 'New wine created', wine: doc });
                }
              });
            }
          }
        }
      });
    });
  } else {
    return res.status(500).json({
      message: 'Error occured',
    });
  }
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
const addLabel = (req, res) => {
  const { image, labelId } = req.body;
  if (image && labelId) {
    const imageData = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(imageData, 'base64');
    fs.writeFile(`client/public/img/labels/${labelId}.png`, buffer, (err) => {
      if (err) {
        return res.status(500);
      } else {
        res.status(200);
      }
    });
  }
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
        const newIngredients = [];
        let i = 0;
        const len = ingredients.length;
        ingredients.forEach(async function (ingredient) {
          if (!ingredient._id) {
            const newIngredient = new Ingredient({
              type: ingredient.type,
              amount: ingredient.amount,
              comment: ingredient.comment,
            });
            newIngredient.save((err3, prod) => {
              newIngredients.push(prod);
            });
          } else {
            newIngredients.push(ingredient);
          }
          i++;

          if (i == len) {
            await new Promise((resolve) => {
              const interval = setInterval(() => {
                if (newIngredients.length == len) {
                  resolve();
                  clearInterval(interval);
                }
              }, 10);
            });
            console.log(newIngredients);
            doc.ingredients = newIngredients;
            if (totalCost == '') {
              return res
                .status(500)
                .json({ message: 'Error occured', error: err });
            }
            if (totalCost) {
              if (isNaN(totalCost)) {
                return res
                  .status(500)
                  .json({ message: 'Error occured', error: err });
              } else {
                doc.totalCost = totalCost;
              }
            }
            if (startingGravity == '') {
              return res
                .status(500)
                .json({ message: 'Error occured', error: err });
            }
            if (startingGravity) {
              doc.startingGravity = startingGravity;
            }
            if (finalGravity) {
              doc.finalGravity = finalGravity;
            }
            if (startingVolume == '') {
              return res
                .status(500)
                .json({ message: 'Error occured', error: err });
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

            if (comments && comments.length > 0) {
              const newComments = [];
              const len2 = comments.length;
              let j = 0;

              comments.forEach(async function (comment) {
                if (!comment._id) {
                  const newComment = new Comment({
                    text: comment.text,
                  });
                  newComment.save((err2, prod2) => {
                    newComments.push(prod2);
                  });
                } else {
                  newComments.push(comment);
                }
                j++;
                if (j == len2) {
                  await new Promise((resolve) => {
                    const interval = setInterval(() => {
                      if (newComments.length == len2) {
                        resolve();
                        clearInterval(interval);
                      }
                    }, 10);
                  });
                  if (labelId) {
                    doc.labelId = labelId;
                  }

                  doc.save({ runValidators: true }, (err3, doc3) => {
                    if (err3) {
                      return res
                        .status(500)
                        .json({ message: 'Error occured', error: err3 });
                    }
                    return res.status(200).json({ wine: doc3 });
                  });
                }
              });
            } else {
              console.log(doc);
              if (labelId) {
                doc.labelId = labelId;
              }
              doc.save({ runValidators: true }, (err2, doc2) => {
                if (err2) {
                  return res
                    .status(500)
                    .json({ message: 'Error occured', error: err2 });
                }
                return res.status(200).json({ wine: doc2 });
              });
            }
          }
        });
      } else {
        return res.status(500).json({ message: 'Error occured', error: err });
      }
    } else {
      return res.status(500).json({ message: 'Error occured', error: err });
    }
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
  addLabel,
};
