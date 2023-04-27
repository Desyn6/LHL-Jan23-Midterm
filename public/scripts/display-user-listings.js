//this function searches and appends filtered listings to the /search rout. however this function is handled in the /api/search rout

if($('.appending_listings_container').length > 0)
{
$(document).ready(function () {
 
    $.ajax({
      method: 'post',
      url: '/api/listings',
    })
    .then((response) => {
      console.log('from jquery', response)
      renderListings(response)
    });


  });

}