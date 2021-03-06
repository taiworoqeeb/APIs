const User = require('../models/Usermodel');
require('dotenv').config();
const { Strategy, ExtractJwt } = require('passport-jwt');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN
}

module.exports = (passport) => {
    passport.use(
        new Strategy(options, async(payload, done) => {
            await User.findById(payload.user_id).then(user => {
            if(user){
                return done(null, user);
            }
                return done(null, false);
            
        })
        .catch(err => {
            return done(null, false); 
        });
    })
    
    );
    passport.serializeUser(function (user, done) {
       done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};