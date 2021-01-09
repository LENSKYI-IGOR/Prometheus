const express = require('express');

const router = express.Router();
const passport = require('passport');

const auth = require('../controllers/auth');
const authController = require('../controllers/auth');
const users = require('../controllers/user.controller');

/** .GET routes* */

router.get('/oauth', (req, res) => res.render('oauth'));

router.post('/email', auth.OAuthMail);

router.get('/email', (req, res) => res.render('email.ejs'));

router.get('/activate/:id', auth.activateAccount);

/** Routes for OAuth (Facebook, Twitter, Google) * */

router
  .route('/facebook')

  .get(passport.authenticate('facebook'));

router
  .route('/facebook/callback')

  .get(
    passport.authenticate('facebook', {
      failureRedirect: '/auth/login',
      session: false,
    }),
    (req, res) => {
      auth.OAuthLogin(req.user, req, res);
    },
  );

router.route('/twitter').get(passport.authenticate('twitter'));

router
  .route('/twitter/callback')
  .get(
    passport.authenticate('twitter', {
      failureRedirect: '/auth/login',
      session: false,
    }),
    (req, res) => {
      auth.OAuthLogin(req.user, req, res);
    },
  );

router.route('/google').get(passport.authenticate('google'));

router
  .route('/google/callback')
  .get(
    passport.authenticate('google', {
      failureRedirect: '/auth/login',
      session: false,
    }),
    (req, res) => {
      auth.OAuthLogin(req.user, req, res);
    },
  );

/** .POST routes* */

router.post('/refresh-tokens', auth.refreshTokens);

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/profile/edit/:id', users.editUser);

module.exports = router;
