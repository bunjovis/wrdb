const express = require('express');
const controller = require('../controllers/wines');
const auth = require('../middleware/authentication');

const router = express.Router();

router.use((req, res, next) => auth.verifyLogin(req, res, next));
router.use((req, res, next) => auth.verifyRole(req, res, next));
router.get('/', controller.listWines);
router.post('/', controller.addWine);
router.post('/labels', controller.addLabel);
router.get('/:id', controller.showWine);
router.put('/:id', controller.editWine);
router.delete('/:id', controller.deleteWine);

module.exports = router;
