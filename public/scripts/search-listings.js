//this function searches and appends filtered listings to the /search rout. however this function is handled in the /api/search rout
$(document).ready(function () {
  $('#search_form').submit((event) => {
    event.preventDefault()
    $.ajax({
      method: 'post',
      url: '/api/search',
      data: {title: $('#title').val(), datePosted: $('#date-posted').val(), askingPrice: $('#asking-price').val()}
    })
    .then((response) => {
      renderListings(response)
    });
  });
});
