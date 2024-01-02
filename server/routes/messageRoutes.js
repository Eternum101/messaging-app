const express = require('express');
const passport = require('passport');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/', passport.authenticate('jwt', { session: false }), messagesController.getMessages);
router.post('/', passport.authenticate('jwt', { session: false }), messagesController.postMessage);

module.exports = router;
