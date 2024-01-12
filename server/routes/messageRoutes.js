const express = require('express');
const passport = require('passport');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/', passport.authenticate('jwt', { session: false }), messagesController.getMessages);
router.post('/', passport.authenticate('jwt', { session: false }), messagesController.postMessage);
router.get('/unread', passport.authenticate('jwt', { session: false }), messagesController.getUnreadMessages);
router.put('/:id/read', passport.authenticate('jwt', { session: false }), messagesController.readMessage);

module.exports = router;
