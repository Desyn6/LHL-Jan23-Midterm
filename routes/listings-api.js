/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const generalQueries = require('../db/queries/general');

//this function searches and appends filtered listings to the listings owned by a user
router.post('/', (req, res) => {
  let email = req.session['userInfo']
  generalQueries
    .getUserByEmail(email)
    .then((user) => {
      generalQueries
      .getListingsByUserId(user.id)
      .then((listings) => {
        if(!listings) {
          return res.send('item not found')
        } 
          return res.json(listings)
      })
    })
})

router.post('/index', (req, res) => {
  generalQueries
  .getListingsUpForSale(req.body, 8)
  .catch((error) => {
    console.log('searched item not found', error.message)
  })

  .then((searchFilterObj) => {
    if(!searchFilterObj) {
      return res.send('item not found')
    }
      console.log(searchFilterObj)
      return res.json(searchFilterObj)
  })
})

//this function appends listings to the favorite items page
router.post('/favorites', (req, res) => {
  let email = req.session['userInfo']
  if(!email){
    return res.json('no logged user')
  }

  generalQueries
    .getUserByEmail(email)
    .then((user) => {
      generalQueries
        .getFavoritesByUserId(user.id)
        .then((favorites) => {
          let favListingsPromises = []
          for(let i of favorites){
              favListingsPromises.push(generalQueries
                .getListingsById(i['listing_id'])
                )
          }
          Promise.all(favListingsPromises)
          .then((favListings)=>{
            let final = []
            for(let i of favListings){
              if(i) {
                final.push(i)
              }
            }
            console.log(final)
          return res.send(final)
          })
       })
    })
})


module.exports = router;