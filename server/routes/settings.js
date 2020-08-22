const express = require('express');
const controller = require('../controllers/settings');
const auth = require('../middleware/authentication');

const router = express.Router();

router.get('/', controller.showSettings);
router.use((req, res, next) => auth.verifyLogin(req, res, next));
router.use((req, res, next) => auth.verifyRole(req, res, next));
router.post('/', controller.setSettings);

module.exports = router;
