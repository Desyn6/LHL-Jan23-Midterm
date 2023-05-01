const express = require('express');
const router  = express.Router();
const generalQueries = require('../db/queries/general');

router.get('/', (req, res) => {
  const userEmail = req.session.userInfo;
  const listingId = req.query.listingId;

  generalQueries
    .getConversation(listingId, userEmail)
    .then((data) => res.send(data))
});

router.post('/', (req, res) => {
  console.log(req.session)
})

module.exports = router;