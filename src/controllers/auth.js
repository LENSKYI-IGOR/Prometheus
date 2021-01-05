const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Hashids = require('hashids/cjs');
const EmailValidator = require('email-validator');
const PasswordValidator = require('password-validator');
const nodemailer = require('../config/nodemailer');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const authHelper = require('../config/authHelper');
const error = require('../middlewares/errorHandler');
require('dotenv').config();

/** Update and Refresh Tokens **/

const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
    .then(() => ({
      accessToken,
      refreshToken: refreshToken.token,
    }));
};

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;
  const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  if (payload.type !== 'refresh') {
    res.status(400).json({ message: error.invalidToken });
    return;
  }
  Token.findOne({ tokenId: payload.id })
    .exec()
    .then((token) => {
      if (token === null) {
        throw new Error(error.invalidToken);
      }
      return updateTokens(token.userId);
    })
    .then((tokens) => res.json(tokens))
    .catch((err) => res.status(400).json({ message: err.message }));
};

/** Email Register and activating modules **/

const mailRegister = async (email, cookie, res) => {
  const isRegistered = await User.findOne({ _id: cookie.toString() });
  const hashids = new Hashids();

  const id = hashids.encodeHex(cookie.toString());

  if ((isRegistered && isRegistered.email && !isRegistered.role)
    || (isRegistered && !isRegistered.email)) {
    User.findOneAndUpdate(
      { _id: isRegistered._id },
      { email },
      {
        upsert: true,
      },
      () => {
        nodemailer.transporter.sendMail({
          from: 'prometheus.app@zohomail.eu',
          to: email.toString(),
          subject: 'Activating of your email address',
          text: `${process.env.SITE_URL}/api/auth/activate/${id}`,
        });
      },
    );
    res.status(200).json({ message: `Success, we have sent activation link to ${email.toString()}` });
  } else {
    res.status(401).json({
      message:
        'Something went wrong, try to log in again',
    });
  }
};

const OAuthMail = async (req, res) => {
  if (EmailValidator.validate(req.body.email) && req.cookies.id) {
    await mailRegister(req.body.email, req.cookies.id, res);
  } else if (EmailValidator.validate(req.body.email) && !req.cookies.id) {
    res.status(401).json({ message: error.OAuthEmptyCookie });
  } else {
    res.status(401).json({ message: error.invalidEmail });
  }
};

const activateAccount = async (req, res) => {
  const hashids = new Hashids();
  const hex = hashids.decodeHex(req.params.id);
  const isUser = await User.findOne({ _id: hex });

  if (isUser.email && !isUser.role) {
    User.findOneAndUpdate(
      { _id: hex },
      { role: 'user' },
      {
        upsert: true,
      },
      () => {
        updateTokens(isUser._id).then((newTokens) => res.json(newTokens));
      },
    );
  } else if (isUser.email && isUser.role) {
    res
      .status(401)
      .json({ message: error.confirmedEmail });
  } else {
    res.status(401).json({
      message:
      error.errorRegister,
    });
  }
};

/**
 * Login with email/password
 * */

const login = async (req, res) => {
  if (EmailValidator.validate(req.body.email)) {
    const isUser = await User.findOne({ email: req.body.email });

    if (isUser) {
      const isPassword = bcrypt.compareSync(req.body.password, isUser.password);
      if (isPassword && isUser.role) {
        updateTokens(isUser._id).then((newTokens) => res.json(newTokens));
      } else if (isPassword && !isUser.role) {
        res.cookie('id', isUser._id, {
          maxAge: 36000 * 25,
          httpOnly: true,
          domain: 'localhost',
        });
        res.status(401).json({ message: error.notConfirmedEmail });
      } else {
        res
          .status(401)
          .json({ message: error.invalidEmailOrPassword });
      }
    }
  } else {
    res.status(401).json({ message: error.invalidEmailOrPassword });
  }
};

/**
 * Register a new user with email/password
 * */

const register = async (req, res) => {
  if (EmailValidator.validate(req.body.email)) {
    const isUser = await User.findOne({ email: req.body.email });

    if (!isUser) {
      const customPasswordValidator = new PasswordValidator();
      customPasswordValidator.digits()
        .is()
        .min(8)
        .is()
        .max(64)
        .has()
        .uppercase();

      if (
        customPasswordValidator.validate(req.body.password)
      ) {
        const salt = bcrypt.genSaltSync(10);
        const { password } = req.body;
        const user = new User({
          email: req.body.email,
          password: bcrypt.hashSync(password, salt),
        });

        await user.save();
        await mailRegister(req.body.email, user._id, res);
      } else {
        res.status(401)
          .json({
            message:
              error.invalidPassword,
          });
      }
    } else {
      res.status(201)
        .json({ message: 'User was successfully created' });
    }
  } else {
    res.status(401).json({ message: error.invalidEmail });
  }
};

/** Login with OAuth (Facebook, Google, Twitter) * */

const OAuthLogin = async (user, req, res) => {
  const requestUser = {};
  const { provider } = req.user;

  switch (provider) {
    case 'facebook':
      requestUser.FacebookID = req.user.id;
      break;

    case 'apple':
      requestUser.AppleID = req.user.id;
      break;

    case 'twitter':
      requestUser.TwitterID = req.user.id;
      break;

    case 'google':
      requestUser.GoogleID = req.user.id;
      break;

    default:
      requestUser.ID = req.user.id;
  }

  const isUser = await User.findOne(requestUser);

  if (isUser && isUser.email && isUser.role) {
    updateTokens(isUser._id).then((newTokens) => res.json(newTokens));
  } else if (
    (isUser && isUser.email && !isUser.role)
    || (isUser && !isUser.email)
  ) {
    await res.cookie('id', isUser._id, {
      maxAge: 36000 * 25,
      httpOnly: true,
      domain: 'localhost',
    });
    res.redirect('/api/auth/email');
  } else if (!isUser) {
    const newUser = new User(requestUser);
    await newUser.save();
    res.cookie('id', newUser._id, {
      maxAge: 36000 * 25,
      httpOnly: true,
      domain: 'localhost',
    });
    res.redirect('/api/auth/email');
  } else {
    res.status(401).json({
      message:
        error.OAuthError,
    });
  }
};

module.exports = {
  mailRegister,
  updateTokens,
  refreshTokens,
  register,
  login,
  OAuthLogin,
  activateAccount,
  OAuthMail,

};
