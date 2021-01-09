/** Errors 4** * */
module.exports.invalidEmail = {
  code: '401A',
  desc: {
    tr: 'invalid_email',
    human: 'INVALID EMAIL FORMAT',
  },
};

module.exports.invalidEmailOrPassword = {
  code: '401B',
  desc: {
    tr: 'invalid_email_or_password',
    human: 'INVALID EMAIL OR PASSWORD',
  },
};

module.exports.invalidPassword = {
  code: '401C',
  desc: {
    tr: 'invalid_password_format',
    human: 'INVALID PASSWORD FORMAT, PASSWORD SHOULD HAVE AT LEAST 8-64 DIGITS WITH MIN 1 UPPERCASE',
  },
};

module.exports.OAuthError = {
  code: '401D',
  desc: {
    tr: 'invalid_social_network_notification',
    human: 'INVALID PASSWORD FORMAT, PASSWORD SHOULD HAVE AT LEAST 8-64 DIGITS WITH MIN 1 UPPERCASE',
  },
};

module.exports.confirmedEmail = {
  code: '401E',
  desc: {
    tr: 'confirmed_email',
    human: 'YOU ARE ALREADY CONFIRMED YOUR EMAIL',
  },
};

module.exports.errorRegister = {
  code: '401F',
  desc: {
    tr: 'not_registered_or_something_went_wrong',
    human: 'YOU ARE NOT REGISTERED OR SOMETHING WENT WRONG',
  },
};

module.exports.notConfirmedEmail = {
  code: '401G',
  desc: {
    tr: 'not_activated_account',
    human: 'Your account is not activated, please go to email, and confirm your registration',
  },
};

module.exports.OAuthEmptyCookie = {
  code: '401H',
  desc: {
    tr: 'empty_cookie_for_OAuth',
    human: 'Please, log in again and type your email',
  },
};

/** Errors 1** * */

module.exports.invalidToken = {
  code: '101A',
  desc: {
    tr: 'invalid_token',
    human: 'YOU HAVE INVALID TOKEN, LOG IN AGAIN',
  },
};

module.exports.expiredToken = {
  code: '101B',
  desc: {
    tr: 'expired_token',
    human: 'YOU HAVE EXPRIRED TOKEN, LOG IN AGAIN',
  },
};

module.exports.noPermissions = {
  code: '101C',
  desc: {
    tr: 'no_permissions',
    human: 'YOU HAVE NO PERMISSIONS',
  },
};
