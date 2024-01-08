const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/current', userController.getCurrentUser);
router.put('/current', userController.updateCurrentUser);

module.exports = router;