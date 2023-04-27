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
          return res.json([listings])
      })
    })

})

module.exports = router;
