
const express = require('express');
const router  = express.Router();


router.get('/', (req, res) => {
  const templateVars = { user: req.session.userInfo };
  res.render('mailbox', templateVars);
  let email = req.session['userInfo']
  
  //checking if user is loged
  if(!email){
    return res.redirect('/login')
  } 
  res.render('mailbox');
});

module.exports = router;
