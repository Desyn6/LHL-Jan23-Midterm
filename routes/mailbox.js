
const express = require('express');
const router  = express.Router();


router.get('/', (req, res) => {
  let email = req.session['userInfo']
  console.log("req.session----", req.session)
  const templateVars = { user: req.session.userInfo };
  res.render('mailbox', templateVars);
  //checking if user is loged
  if(!email){
    return res.redirect('/login')
  }
  // res.render('mailbox');
});

module.exports = router;
