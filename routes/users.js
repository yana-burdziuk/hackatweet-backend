// Express imports
const express = require('express');
const router = express.Router();
// Modules imports
const checkBody = require('../modules/checkBody')
// Database imports
require('../models/connection')
const User = require("../models/users");
// JWT imports
const uid2 = require("uid2");
const bcrypt = require("bcrypt");


// SIGN-UP ROUTE
router.post('/signup', async (req, res, next) => {
  // Data in
  const {firstName, username, password} = req.body;

  // Logic & data out
  try {
    // (1) Checking all fields were filled :
    if(!checkBody(req.body, ["firstName", "username", "password"]))
      res.status(400).send({
        result: false,
        error: "Missing and/or empty fields"
      })
    else {
    // (2) Checking if the user exists :
      let user = await User.findOne({firstName, username});
      if(user)
        res.status(400).send({
          result: false,
          error: "User already exists"
        })
      else {
    // (3) Saving the user to DB
        user = new User({
          firstName: firstName,
          username: username,
          password: bcrypt.hashSync(password, 10),
          token: uid2(32)
        })

        await user.save()
        res.status(201).send({
          result: true,
          message: "User signed up!",
          token: user.token
        })
      }

    }
  } catch (error) {
    console.error("Error signing up user: ", error);
    res.status(500).send({
      result: false,
      error: 'Server error'
    })
  }

});

// SIGN-IN ROUTE
router.post('/signin', async (req, res, next) => {
  // Data in

  const { username, password } = req.body;

  // Logic & data out
  try {
    // (1) Checking all fields were filled :

    if(!checkBody(req.body, ["username", "password"]))

      res.status(400).send({
        result: false,
        error: "Missing and/or empty fields"
      })
    else {
      // (2) Checking if the user exists :

      const user = await User.findOne({username});
      if(!user)
        res.status(404).send({
          result: false,
          error: "User not found"
        })
      else {
        // (3) Checking if the password is correct
        if(bcrypt.compareSync(password, user.password))
          res.status(201).send({
            result: true,
            message: "User signed in!",
            token: user.token
          })
        else {
          res.status(400).send({
            result: false,
            error: "Incorrect password"
          })
        }
      }
    }
  } catch (error) {
    console.error("Error signing up user: ", error);
    res.status(500).send({
      result: false,
      error: 'Server error'
    })
  }

});

module.exports = router;
