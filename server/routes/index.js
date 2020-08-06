const express = require('express');
const users = require('./users');
const wines = require('./wines');
const ingredients = require('./ingredients');
const ingredientTypes = require('./ingredientTypes');

const router = express.Router();

router.use('/users', users);
router.use('/wines', wines);
router.use('/ingredients', ingredients);
router.use('/ingredienttypes', ingredientTypes);
router.use('/', (req, res) => {
  res.json({
    routes: [
      {
        href: '/users',
      },
      {
        href: '/wines',
      },
      {
        href: '/ingredients',
      },
      {
        href: '/ingredienttypes',
      },
    ],
  });
});

module.exports = router;
