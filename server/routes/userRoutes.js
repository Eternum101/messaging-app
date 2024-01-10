const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const multer = require('multer');
const upload = multer();

router.get('/', userController.getAllUsers);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/current', userController.getCurrentUser);
router.put('/current', upload.single('image'), userController.updateCurrentUser);

module.exports = router;