
const express = require('express');
const router  = express.Router();


router.get('/', (req, res) => {
  let email = req.session['userInfo']
  //checking if user is loged
  if(!email){
    return res.redirect('/login')
  } 
  res.render('mailbox');
});

module.exports = router;