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

// grabs message and listing_id from req.body, grabs email from session
// redirects to current mailbox page display the new message at the top of messages
router.post('/', (req, res) => {
  const email = req.session.userInfo;
  const { message, listing_id } = req.body;
  generalQueries
    .addMessage(listing_id, email, message)
    .then((data) => {
      res.redirect(`/mailbox?lid=${listing_id}`);
    })
    .catch((error) => {
      console.log("ERROR", error);
    });
});

module.exports = router;
