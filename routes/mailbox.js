
const express = require('express');
const router  = express.Router();

//mailbox goes in mailbox file
router.get('/', (req, res) => {
  const templateVars = { user: req.session.userInfo };
  res.render('mailbox', templateVars);
});

module.exports = router;
