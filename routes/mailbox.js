const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  let email = req.session['userInfo'];
  //checking if user is logged
  if (!email) {
    return res.redirect('/login');
  }
  // pass email and listing_id to mailbox.ejs
  const templateVars = { user: req.session.userInfo, listing_id: req.query.lid};
  res.render('mailbox', templateVars);

});

module.exports = router;
