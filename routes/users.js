/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const generalQueries = require('../db/queries/general');

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

  //check for empty fields
  if (!newUser.Name || !newUser.email || !newUser.password || !newUser['phone-number'] || !newUser.city || !newUser['confirm-password']) {
    return res.send ({error: 'empty field(s)'})
  }

  //check if both password fields match, then hash user's password
  if (newUser.password !== newUser['confirm-password']){
    return res.send ({error: 'passwords not matching'})
  }
  newUser.password = hashedPassword

    generalQueries
      //tries to search for a user that is attempting to register
      .getUserByEmail(newUser.email)
      .then(checkUser => {
        //check if user exists
        if(checkUser){
          return res.send ({error: 'user already registered'})
        }
        //if user does not exist add user to the db, add a cookie with user's encrypted email then redirect to home page
        generalQueries
          .addUser(newUser)
          req.session.useInfo = newUser.email
          return res.redirect('/');
        })
        .catch((error) => {
          return res.send (error.message)
      })
});

//the following rout logs in an existing user, and saves encrypted user's email as a cookie
router.post("/login", (req, res) => {
  let existingUser = req.body;

  //check for empty fields
  if (!existingUser.email || !existingUser.password) {
    return res.send ({error: 'empty field(s)'})
  }
  
    generalQueries
      .getUserByEmail(existingUser.email)
      .then(checkUser => {
        //check if user is registered
        if(!checkUser) {
          return res.send ({error: 'user not registered'})
        }

        //check if both passwords match
        if(!bcrypt.compareSync(existingUser.password, checkUser.password)){
          return res.send ({error: 'incorrect password'})
        }

        //if user is registered and password matches save an encrypted cookie file and redirect user to home page
          req.session.userInfo = existingUser.email
          return res.redirect('/');
        })
        .catch((error) => {
          return res.send (error.message)
      })
});

//this rout deletes the saved cookie and redirects user to home page
router.get("/logout", (req, res) => {
  req.session = null;
  return res.redirect('/')
})

//the following rout creates a new listing, and adds the info to the database
router.post("/create", (req, res) => {
  let newListing = req.body;
  const userEmail = req.session.userInfo

  //check if user is logged in
  if(!generalQueries.getUserByEmail(userEmail)) {
    res.redirect('/login')
  }

  //check for empty fields
  if (!newListing.title || !newListing.description || !newListing.condition || !newListing['asking-price'] || !newListing['thumbnail-url'] || !newListing.photos) {
    return res.send ({error: 'empty field(s)'})
  }

  generalQueries
  //find id of logged user
  .getUserByEmail(userEmail)
    .then(userObject => {
        //add user's id to newListing object
        newListing.owner_id = userObject.id

        //create new listing
        generalQueries.addListing(newListing)

        //find id of newly created listing
        generalQueries
          .getListingsById(userObject.id)
          .then((newListingObject) => {
            //use id of new listing to insert photos into photos table
            generalQueries.addPhotos({
              listing_id: newListingObject.id, 
              url: newListing.photos
            })
          })

        return res.redirect('/manage');
        })
        .catch((error) => {
          return res.send (error.message)
      })
});

module.exports = router;
