const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  let email = req.session['userInfo']
  //Check if user is logged in
  if(!email) return res.redirect('/login');

  const templateVars = { user: req.session.userInfo };
  res.render('mailbox', templateVars);
});

module.exports = router;