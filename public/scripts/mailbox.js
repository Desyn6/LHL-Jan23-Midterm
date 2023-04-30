// Get listing id from url search string
const listingId = getParam('lid');

$( document ).ready(
  $.get('/api/mailbox/', {listingId})
)