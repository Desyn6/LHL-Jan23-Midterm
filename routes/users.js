/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  res.render('users');
}); 

router.get('/search', (req, res) => {
  res.render('search');
});

//the following rout creates a new user, adds the info to the database and saves encrypted user's email as a cookie
router.post("/register", (req, res) => {
  let newUser = req.body;
  const hashedPassword = bcrypt.hashSync(newUser.password, 10);
  newUser.password = hashedPassword
  
    userQueries.addUser(newUser)
    req.session['user_id'] = newUser.email
    return res.redirect('/');
  
});

module.exports = router;
