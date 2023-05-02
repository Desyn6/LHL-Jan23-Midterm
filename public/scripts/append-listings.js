//this function searches and appends filtered listings to the /search rout. however this function is handled in the /api/search rout
$(document).ready(function () {
  if($('#manage_listings_container').length > 0)
  {
  const idSelector = '#manage_listings_container'
    $.ajax({
      method: 'post',
      url: '/api/listings',
    })
    .then((response) => {
      renderManageListings(response, idSelector)
    });
  }

  //this function appends listings to the / rout.
  if($('#index_listings_container').length > 0)
  {
    const idSelector = '#index_listings_container'
    $.ajax({
      method: 'post',
      url: '/api/listings/index',
    })
    .then((response) => {
      renderListings(response, idSelector)
    });
  }

  //this function appends listings to the favorite items page.
  if($('#favorite_items_listings_container').length > 0)
  {
    const idSelector = '#favorite_items_listings_container'
    $.ajax({
      method: 'post',
      url: '/api/listings/favorites',
    })
    .then((response) => {
      renderListings(response, idSelector)
    });
  }

  //this function appends listings to the "my listings" page.
  if($('#manage_listings_container').length > 0)
  {
    const idSelector = '#manage_listings_container'
    $.ajax({
      method: 'post',
      url: '/api/listings',
    })
    .then((response) => {
      renderManageListings(response, idSelector)
    });
  }
});
