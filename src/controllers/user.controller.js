const error = require('../middlewares/errorHandler');
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
