const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

// Load models
const User = require('../../model/User');
const Profile = require('../../model/Profile');

// @route GET api/profile/test
// @desc Test profile route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

// @route GET api/profile
// @desc Get current users profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
