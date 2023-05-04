/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const generalQueries = require('../db/queries/general');

//This rout runs th function generalQueries that is declared in db/queries/users.js
router.get('/', (req, res) => {

  generalQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

});

router.get('/userInfo', (req, res) => {
  generalQueries
    .getUserById(req.query.userId)
    .then((data) => res.send(data[0]))
})

module.exports = router;
