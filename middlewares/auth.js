const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = jwt.verify(token, process.env.secret);
      const user = await User.findById(decode.userId);
      if (!user) {
        return res.json({ success: false, message: 'unauthorized access a!' });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.json({ success: false, message: 'unauthorized access b!' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.json({
          success: false,
          message: 'sesson expired try sign in!',
        });
      }

      res.res.json({ success: false, message: 'Internal server error!' });
    }
  } else {
    res.json({ success: false, message: 'unauthorized access c!' });
  }
};
