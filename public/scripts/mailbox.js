// Get listing id from url search string
const urlListingId = getParam('lid');

// send get request to render thread if redirected with lid 
if(urlListingId) {
  $.get('/api/mailbox/', {urlListingId})
    .then((data) => renderMessages(data));
}

$(document).ready(function() {
  //listeners to send get request to mailbox
  //from-buyer listeners
  $('.buyer-query').on('click', function() {
    const $buyerEmail = $(this).children().children('.buyer-email').text();
    const $listingId = $(this).children().children('.listing-id').text();

    console.log($buyerEmail, $listingId)
  });

  //to-seller listeners
  $('.to-seller').on('click', function() {
    const $sellerEmail = $(this).children().children('.seller-email').text();
    const $listingId = $(this).children().children('.listing-id').text();

    console.log($sellerEmail, $listingId)
  });
})