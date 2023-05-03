// Get listing id from url search string
const urlListingId = getParam('lid');

// send get request to render thread if redirected with lid 
if(urlListingId) {
  $.get('/api/mailbox/convo', {urlListingId})
    .then((data) => renderMessages(data));
};

$.get('/api/mailbox/sent')
  .then((data) => renderInboxItems(data, 'sent'));

$.get('/api/mailbox/received')
  .then((data) => renderInboxItems(data, 'received'));  

$(document).ready(function() {
  //listeners to send get request to mailbox
  //from-buyer listeners
  $(document).on('click', '.received-mail', function() {
    const $buyerEmail = $(this).children('.buyer-email').text();
    const $listingId = $(this).children('.listing-id').text();

    console.log($buyerEmail, $listingId)
  });

  //to-seller listeners
  $(document).on('click', '.sent-mail', function() {
    const $sellerEmail = $(this).children('.seller-email').text();
    const $listingId = $(this).children('.listing-id').text();

    console.log($sellerEmail, $listingId)
  });
})