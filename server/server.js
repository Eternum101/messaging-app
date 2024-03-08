require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const app = express();
app.use(cors()); 
const port = process.env.PORT || 5000;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JSON_KEY,
};

const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use(session({
    secret: process.env.JSON_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL })
}));
app.use(cors({
    origin: ["http://localhost:3000", 
    "https://messaging-app-2mr0.onrender.com"],
}));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    console.log('Serializing user: ', user.id);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('Deserializing user: ', id);
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
User.findById(jwt_payload.userId)
    .then(user => {
        console.log('User ID type:', typeof user._id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            return done(err, false);
        });
}));

app.use(passport.initialize());
app.use(passport.session());

const userRoute = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/users', userRoute);
app.use('/messages', messageRoutes);

app.get('/logout', function(req, res){
    req.logout(function(err) {
        if (err) {
            console.log('Logout error:', err);
            return;
        }
        res.redirect('/');
    });
});

app.use('/images', express.static('public/images'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});