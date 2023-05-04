// Get listing id from url search string
const listingId = getParam('lid');
const buyerId = getParam('cid');
const sellerId = getParam('sid');

/* 
This object is used to determine if the current user is a buyer or seller.
Sellers will have a null sellerId,
Buyers will have a null buyerId.
*/
const urlParams = {listingId, buyerId, sellerId}

// call mailbox/convo to fetch convos (buyer AND seller)
// logic for determining the logged-in user is in the route
$.get('/api/mailbox/convo', urlParams)
  .then((data) => renderMessages(data))

// get method to retrieve messages sent by user as a buyer
$.get('/api/mailbox/sent')
  .then((data) => renderInboxItems(data, 'sent'));

// get method to retrieve messages sent by user as a seller
$.get('/api/mailbox/received')
  .then((data) => renderInboxItems(data, 'received'));  

