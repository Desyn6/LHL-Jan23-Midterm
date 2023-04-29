/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const generalQueries = require('../db/queries/general');
const helpers = require('./helpers');

//this rout checks what listings are liked by the logged user
router.post('/like/check', (req, res) => {
  let email = req.session['userInfo']
  if(!email){
    return res.json('no logged user')
  }
  generalQueries
    .getUserByEmail(email)
    .then((user) => {
      generalQueries
        .getFavoritesByUserId(user.id)
        .catch((e)=>{
          console.log(e)
         })
        .then((favorites) => {
          return res.json(favorites)
         })
    })
})

//this function activates liked listings
router.post('/like/add', (req, res) => {
  let email = req.session['userInfo']
  const listingId = req.body.listingId
  generalQueries
    .getUserByEmail(email)
    .then((user) => {
      generalQueries
        .getFavoritesByUserId(user.id)
        .then((favorites) => {
          let newListingObject = {user_id: Number(user.id), listing_id: Number(listingId)}
          let alreadyLiked = false
          for(let i of favorites){
            delete i.id
            if ( helpers.eqObjects(i, newListingObject) ){
               alreadyLiked = true
            }
          }
          if(!alreadyLiked) {
            generalQueries
            .addFavorite(user.id, listingId)
          }
          return res.json(favorites)
      })
    })
})

//this function deactivates liked listings
router.post('/like/remove', (req, res) => {
  let email = req.session['userInfo']
  const listingId = req.body.listingId
  generalQueries
    .getUserByEmail(email)
    .then((user) => {
      generalQueries
        .deleteFavorite(user.id, listingId)
      generalQueries
        .getFavoritesByUserId(user.id)
        .then((favorites) => {
          return res.json(favorites)
      })
    })
})

//this function sets an item to sold
router.post('/sold', (req, res) => {
  let email = req.session['userInfo']
  const listingId = req.body.listingId

  if(!email){
    return res.json('no logged user')
  }

  generalQueries
    .setItemToSold(listingId)
    .then((soldItem) => {
        return res.json(soldItem)
    })
})

//this function sets an item to sold
router.post('/not/sold', (req, res) => {
  let email = req.session['userInfo']
  const listingId = req.body.listingId

  if(!email){
    return res.json('no logged user')
  }

  generalQueries
    .setItemToNotSold(listingId)
    .then((notSoldItem) => {
        return res.json(notSoldItem)
    })
})

//this function sets an item to sold
router.post('/delete', (req, res) => {
  let email = req.session['userInfo']
  const listingId = req.body.listingId

  if(!email){
    return res.json('no logged user')
  }

  generalQueries
    .deleteItem(listingId)
    .then((deletedItem) => {
      console.log(deletedItem)  
      return res.json(deletedItem)
    })
})


module.exports = router;
