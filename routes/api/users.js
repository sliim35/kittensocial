const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
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
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'retro'
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log('error', err));
        });
      });
    }
  });
});

// @route GET api/users/login
// @desc Returning JWT
// @access Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find User by email
  User.findOne({ email }).then(user => {
    if (!user) return res.status(404).json({ email: 'User not found' });

    // Check password
    bcrypt
      .compare(password, user.password)
      .then(isMatch =>
        isMatch
          ? res.json({ msg: 'Success' })
          : res.status(400).json({ password: 'Password incorrect' })
      );
  });
});

module.exports = router;
