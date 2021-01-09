const Hashids = require('hashids/cjs');
const PasswordValidator = require('password-validator');
const EmailValidator = require('email-validator');
const bcrypt = require('bcryptjs');
const error = require('../middlewares/errorHandler');
const nodemailer = require('../config/nodemailer');
const userPermissions = require('../middlewares/userPermissionsChecker');
const User = require('../models/user.model');

module.exports.editUser = async (req, res) => {
  const candidate = await userPermissions(req);
  if (candidate) {
    await User.findByIdAndUpdate(candidate._id, {
      name: req.body.name,
      surname: req.body.surname,
      tel: req.body.tel,
    }, { new: true, upsert: true }, (err, doc) => {
      res.status(200).json({ doc });
    });
  } else {
    res.status(401).json({ message: error.noPermissions });
  }
};

module.exports.passwordRecovery = async (req, res) => {
  if (EmailValidator.validate(req.body.email)) {
    const candidate = await User.findOne({ email: req.body.email });
    console.log(candidate);
    if (candidate) {
      const hashids = new Hashids();

      const id = hashids.encodeHex(candidate._id.toString());

      await nodemailer.transporter.sendMail({
        from: 'prometheus.app@zohomail.eu',
        to: candidate.email.toString(),
        subject: 'Password Recovery For Prometheus Project',
        text: `${process.env.SITE_URL}/api/auth/password-recovery/${id}`,
      });
      res.status(200).json({ message: 'Recovery link was sent to your email address' });
    } else {
      res.status(200).json({ message: 'Recovery link was sent to your email address' });
    }
  }
};

module.exports.newPassword = async (req, res) => {
  const hashids = new Hashids();
  const hex = hashids.decodeHex(req.params.id);
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
    await User.findByIdAndUpdate(hex, {
      password: bcrypt.hashSync(req.body.password.toString(), salt),
    }, { upsert: true }, (err, doc) => res.status(200).json({ doc }));
  }
};
