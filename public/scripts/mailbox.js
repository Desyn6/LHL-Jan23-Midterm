// Get listing id from url search string
const listingId = getParam('lid');

  $.get('/api/mailbox/', {listingId})
  .then((data) => renderMessages(data));