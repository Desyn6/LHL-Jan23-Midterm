
const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const generalQueries = require('../db/queries/general');

router.get('/', (req, res) => {
  const templateVars = { user: req.session.userInfo };
  res.render('register', templateVars);
});

//the following rout creates a new user, adds the info to the database and saves encrypted user's email as a cookie
router.post("/", (req, res) => {
  let newUser = req.body;
  const hashedPassword = bcrypt.hashSync(newUser.password, 10);

  //check for empty fields
  if (!newUser.Name || !newUser.email || !newUser.password || !newUser['phone-number'] || !newUser.city || !newUser['confirm-password']) {
    return res.send({error: 'empty field(s)'});
  }

  //check if both password fields match, then hash user's password
  if (newUser.password !== newUser['confirm-password']) {
    return res.send({error: 'passwords not matching'});
  }
  newUser.password = hashedPassword;

  generalQueries
  //tries to search for a user that is attempting to register
    .getUserByEmail(newUser.email)
    .then(checkUser => {
      //check if user exists
      if (checkUser) {
        return res.send({error: 'user already registered'});
      }
      //if user does not exist add user to the db, add a cookie with user's encrypted email then redirect to home page
      generalQueries
        .addUser(newUser);
      req.session.userInfo = newUser.email;
      return res.redirect('/');
    })
    .catch((error) => {
      return res.send(error.message);
    });
});

module.exports = router;
