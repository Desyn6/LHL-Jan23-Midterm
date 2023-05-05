//this function searches and appends filtered listings to the /search rout.
$(document).ready(function () {
  const idSelector = '#search_form'
  $(idSelector).submit((event) => {
    event.preventDefault()
    $.ajax({
      method: 'post',
      url: '/api/search',
      data: {title: $('#title').val(),
      datePosted: $('#date-posted').val(),
      askingPrice: $('#asking-price').val(),
      maxPrice: $('#max-price').val()}
    })
    .then((response) => {
      renderListings(response, '.appending_listings_search_container')
    });
  });
});
