
const express = require('express');
const router  = express.Router();

//mailbox goes in mailbox file
router.get('/', (req, res) => {
  res.render('mailbox');
});

module.exports = router;