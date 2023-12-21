const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

const authenticateUser = async (req, res, next) => {
  let message;
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });

    if (user) {
      const validPassword = bcryptjs.compareSync(credentials.pass, user.password);

      if (validPassword) {
        req.currentUser = user;
      } else {
        message = 'Authentication failed';
      }
    } else {
      message = 'User not found';
    }
  } else {
    message = 'Authorization header not found';
  }

  if (message) {
    res.status(401).json({ message: 'Access Denied' });
    return;
  }

  next();
};

module.exports = { authenticateUser };