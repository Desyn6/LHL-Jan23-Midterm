
const express = require('express');
const router  = express.Router();
const generalQueries = require('../db/queries/general');

//this rout renders the "My Listings page"
router.get('/', (req, res) => {
  let email = req.session['userInfo'];
  //checking if user is loged
  if (!email) {
    return res.redirect('/login');
  }
  const templateVars = { user: req.session.userInfo };
  res.render('manage', templateVars);
});

//this rout renders the search page
router.get('/search', (req, res) => {
  const templateVars = { user: req.session.userInfo };
  res.render('search', templateVars);
});

//this rout renders the create listing page
router.get('/create', (req, res) => {
  const templateVars = { user: req.session.userInfo };
  res.render('create', templateVars);
  let email = req.session['userInfo']

  //checking if user is loged
  if(!email){
    return res.redirect('/login')
  }
  res.render('create')
});

//this rout add a new listing at the submit button event
router.post("/create", (req, res) => {
  let newListing = req.body;
  const userEmail = req.session.userInfo;

  //check if user is logged in
  if (!generalQueries.getUserByEmail(userEmail)) {
    return res.redirect('/login');
  }

  //check for empty fields
  if (!newListing.title || !newListing.description || !newListing.condition || !newListing['asking-price'] || !newListing['thumbnail-url'] || !newListing.photos) {
    return res.send({error: 'empty field(s)'});
  }

  generalQueries
  //find id of logged user
    .getUserByEmail(userEmail)
    .then(userObject => {
      //add user's id to newListing object
      newListing.owner_id = userObject.id;

      //create new listing
      generalQueries.addListing(newListing);

      //find id of newly created listing
      generalQueries
        .getListingsById(userObject.id)
        .then((newListingObject) => {
          //use id of new listing to insert photos into photos table
          generalQueries.addPhotos({
            listing_id: newListingObject.id,
            url: newListing.photos
          });
        });

      return res.redirect('/listings');
    })
    .catch((error) => {
      return res.send(error.message);
    });
});

//this rout renders the page featuring user's favorite items
router.get('/favorites', (req, res) => {
  const templateVars = { user: req.session.userInfo };
  res.render('favorites', templateVars);
  let email = req.session['userInfo']
  //checking if user is loged
  if(!email){
    return res.redirect('/login')
  }
  res.render('favorite-items')
})

module.exports = router;
