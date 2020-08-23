const express = require('express');
const multer = require('multer');
const controller = require('../controllers/settings');
const auth = require('../middleware/authentication');

const router = express.Router();
// Set up multer for uploading images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'client/public/');
  },
  filename(req, file, cb) {
    cb(null, 'logo.png');
  },
});
// Set up limits for files: only png images and max 5MB in size
const allowedTypes = ['image/png'];
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (allowedTypes.indexOf(file.mimetype) < 0) {
      return cb(null, false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1000000 },
}).single('image');

router.get('/', controller.showSettings);
router.use((req, res, next) => auth.verifyLogin(req, res, next));
router.use((req, res, next) => auth.verifyRole(req, res, next));
router.post('/', controller.setSettings);
router.post('/logo', upload, controller.addLogo);

module.exports = router;
