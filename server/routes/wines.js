const express = require('express');
const controller = require('../controllers/wines');
const auth = require('../middleware/authentication');

const router = express.Router();

router.use((req, res, next) => auth.verifyLogin(req, res, next));
router.use((req, res, next) => auth.verifyRole(req, res, next));
router.get('/', controller.listWines);
router.post('/', controller.addWine);
router.get('/:id', controller.showWine);
router.put('/:id', controller.editWine);
router.delete('/:id', controller.deleteWine);
router.get('/:id/comments', controller.listComments);
router.post('/:id/comments', controller.addComment);
router.get('/:id/comments/:commentid', controller.showComment);
router.put('/:id/comments/:commentid', controller.editComment);
router.delete('/:id/comments/:commentid', controller.deleteComment);

module.exports = router;
