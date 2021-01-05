const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const FacebookStrategy = require('passport-facebook');
const TwitterStrategy = require('passport-twitter');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

require('dotenv').config();
const User = require('../models/user.model');

const options = {

  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('jwt'),

};

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.userId).select('email id');

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (e) {
    console.log(e);
  }
};

passport.use(new FacebookStrategy({
  clientID: '172268524266580',
  clientSecret: '8d2bed7293e7bb5bd3f749fc3eadd43f',
  callbackURL: 'http://localhost:7777/api/auth/facebook/callback',

},
((accessToken, refreshToken, profile, done) => done(null, profile))));

passport.use(new TwitterStrategy({
  consumerKey: '1wlKu88RmEYSuCxQIzabQnDsh',
  consumerSecret: 'lixOYuuvgsJLBmWhL3tnTjLLiFoz1PWdfwe7g9BgShQDXaoeJ1',
  callbackURL: '/api/auth/twitter/callback',
  scope: ['profile'],
},
((token, tokenSecret, profile, done) => done(null, profile))));

passport.use(new GoogleStrategy({
  clientID: '82125339286-efnka98lldndbelkddhrkn68g70kt8mg.apps.googleusercontent.com',
  clientSecret: 'Jo_0u6js1GAbynbJBOEMyI7N',
  callbackURL: 'http://localhost:7777/api/auth/google/callback',
  scope: ['profile'],
},
((accessToken, refreshToken, profile, done) => done(null, profile))));

exports.jwt = new JwtStrategy(options, jwt);
