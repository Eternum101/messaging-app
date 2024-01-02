const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.signup = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await jwt.sign({ userId: user._id }, 'SECRET_KEY');
        res.status(201).send({ token });
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.login = async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An error occurred.');
                return next(error);
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                const token = jwt.sign({ userId: user._id }, 'SECRET_KEY');
                return res.json({ token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
};