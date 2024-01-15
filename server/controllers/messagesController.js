const Message = require('../models/Message');
const mongoose = require('mongoose');

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { to: new mongoose.Types.ObjectId(req.query.user), from: req.user._id },
                { from: new mongoose.Types.ObjectId(req.query.user), to: req.user._id }
            ]
        }).populate('from', 'firstName lastName');
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.postMessage = async (req, res) => {
    try {
        const message = new Message({ ...req.body, from: req.user._id });
        await message.save();
        res.json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUnreadMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            to: new mongoose.Types.ObjectId(req.query.user),
            from: { $ne: req.user._id },
            unread: true, 
        }).populate('from', 'firstName lastName image'); 
        console.log('Unread messages:', messages);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching unread messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.readMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        message.unread = false;
        await message.save();
        res.json(message);
    } catch (error) {
        console.error('Error reading message:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
