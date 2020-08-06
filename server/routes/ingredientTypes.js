const express = require('express');
const controller = require('../controllers/ingredientTypes');
const auth = require('../middleware/authentication');

const router = express.Router();

router.use((req, res, next) => auth.verifyLogin(req, res, next));
router.use((req, res, next) => auth.verifyRole(req, res, next));
router.get('/', controller.listIngredientTypes);
router.post('/', controller.addIngredientType);
router.get('/:id', controller.showIngredientType);
router.put('/:id', controller.editIngredientType);
router.delete('/:id', controller.deleteIngredientType);

module.exports = router;
