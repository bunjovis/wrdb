const express = require('express');
const controller = require('../controllers/ingredients');
const auth = require('../middleware/authentication');

const router = express.Router();

router.use((req, res, next) => auth.verifyLogin(req, res, next));
router.use((req, res, next) => auth.verifyRole(req, res, next));
router.get('/', controller.listIngredients);
router.post('/', controller.addIngredient);
router.get('/:id', controller.showIngredient);
router.put('/:id', controller.editIngredient);
router.delete('/:id', controller.deleteIngredient);

module.exports = router;
