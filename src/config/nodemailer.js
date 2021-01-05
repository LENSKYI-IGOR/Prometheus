const nodemailer = require('nodemailer');

module.exports.transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.zoho.eu',
  auth: {
    user: 'prometheus.app@zohomail.eu',
    pass: 'Swordfish8554',
  },
  secure: true,
});

/**
 * Validator for Email when we register a new user
 * Show error messages  for incorrect email and password separately
 * .env
 * creating errorHandler
 * Invalid jwt signing
 * * */
