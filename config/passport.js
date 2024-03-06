const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../Models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email })
            .then(user => {
            if (!user) {
                return done(null, false, { message: 'That email is not registered' });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                return done(err);
                }
                if (isMatch) {
                return done(null, user);
                } else {
                return done(null, false, { message: 'Incorrect password' });
                }
            });
            })
            .catch(err => done(err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => done(err));
    });
};