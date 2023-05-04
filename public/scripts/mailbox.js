// Get listing id from url search string
const urlListingId = getParam('lid');
const urlBuyerId = getParam('cid');
const urlSellerId = getParam('sid');

const urlParams = {urlListingId, urlBuyerId, urlSellerId}

console.log(urlParams);

// send get request to render thread if redirected with lid 
if(urlListingId) {
  $.get('/api/mailbox/convo', {urlListingId})
    .then((data) => renderMessages(data));
};

$.get('/api/mailbox/sent')
  .then((data) => renderInboxItems(data, 'sent'));

$.get('/api/mailbox/received')
  .then((data) => renderInboxItems(data, 'received'));  

