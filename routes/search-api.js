/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const generalQueries = require('../db/queries/general');

router.post('/', (req, res) => {
  generalQueries
    .getListingsBySearch(req.body)
    .catch((error) => {
      console.log('searched item not found', error.message)
    })

    .then((searchFilterObj) => {
      if(!searchFilterObj) {
        return res.send('item not found')
      }
        return res.json(searchFilterObj)
    })
})

module.exports = router;
