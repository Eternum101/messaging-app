const Message = require('../models/Message');
const mongoose = require('mongoose');

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { to: new mongoose.Types.ObjectId(req.query.user) },
                { from: new mongoose.Types.ObjectId(req.query.user) }
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
