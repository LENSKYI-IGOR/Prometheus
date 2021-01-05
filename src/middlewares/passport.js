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
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `${process.env.SITE_URL}/api/auth/facebook/callback`,
},
((accessToken, refreshToken, profile, done) => done(null, profile))));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_ID,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: `${process.env.SITE_URL}/api/auth/twitter/callback`,
  scope: ['profile'],
},
((token, tokenSecret, profile, done) => done(null, profile))));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: `${process.env.SITE_URL}/api/auth/google/callback`,
  scope: ['profile'],
},
((accessToken, refreshToken, profile, done) => done(null, profile))));

exports.jwt = new JwtStrategy(options, jwt);
