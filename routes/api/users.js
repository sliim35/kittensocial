const express = require('express');
const gravatar = require('gravatar');
const router = express.Router();

// Load User model
const User = require('../../model/User');

// @route GET api/users/test
// @desc Test user route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User works' }));

// @route GET api/users/register
// @desc Register user
// @access Public
router.get('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
    }
  });
});

module.exports = router;
