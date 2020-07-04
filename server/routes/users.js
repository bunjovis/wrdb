const express = require('express');
const controller = require('../controllers/users');
const auth = require('../middleware/authentication');

const router = express.Router();
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.use((req, res, next) => auth.verifyLogin(req, res, next));
router.use((req, res, next) => auth.verifyRole(req, res, next));
router.get('/', controller.listUsers);
router.post('/', controller.addUser);
router.get('/:id', controller.showUser);
router.put('/:id', controller.editUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;
