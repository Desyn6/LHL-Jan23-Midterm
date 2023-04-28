
const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const generalQueries = require('../db/queries/general');

router.get('/', (req, res) => {
  const templateVars = { user: req.session.userInfo };
  res.render('login', templateVars);
});

//the following rout logs in an existing user, and saves encrypted user's email as a cookie
router.post("/", (req, res) => {
  let existingUser = req.body;

  //check for empty fields
  if (!existingUser.email || !existingUser.password) {
    return res.send({"Try Again": 'empty field(s)'});
  }

  generalQueries
    .getUserByEmail(existingUser.email)
    .then(checkUser => {
      //check if user is registered
      if (!checkUser) {
        return res.send({error: 'user not registered'});
      }

      //check if both passwords match
      if (!bcrypt.compareSync(existingUser.password, checkUser.password)) {
        return res.send({error: 'incorrect password'});
      }

      //if user is registered and password matches save an encrypted cookie file and redirect user to home page
      req.session.userInfo = existingUser.email;
      return res.redirect('/');
    })
    .catch((error) => {
      return res.send(error.message);
    });
});

//this rout deletes the saved cookie and redirects user to home page
router.get("/logout", (req, res) => {
  req.session = null;
  return res.redirect('/');
});

module.exports = router;
