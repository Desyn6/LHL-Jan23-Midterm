
const express = require('express');
const router  = express.Router();
const generalQueries = require('../db/queries/general');


router.get('/', (req, res) => {
  res.render('manage')
});

router.get('/search', (req, res) => {
  res.render('search')
})

router.get('/create', (req, res) => {
  res.render('create')
});

router.post("/create/listing", (req, res) => {
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

        return res.redirect('/listings');
        })
        .catch((error) => {
          return res.send (error.message)
      })
});

module.exports = router;