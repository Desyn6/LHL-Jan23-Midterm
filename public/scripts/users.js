//const generalQueries = require('../db/queries/general');
//const helpers = require('./helpers.js');

// Client facing scripts and listeners handled here.
$(() => {
  $('#fetch-users').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/users'
    })
    .done((response) => {
      const $usersList = $('#users');
      $usersList.empty();

      for(const user of response.users) {
        $(`<li class="user">`).text(user.name).appendTo($usersList);
      }
    });
  });
});

//this function searches and appends filtered listings to the /search rout. however this function is handled in the /api/users/search rout
$(document).ready(function () {
  $('#search_form').submit((event) => {
    event.preventDefault()
    $.ajax({
      method: 'post',
      url: '/api/users/search',
      data: {title: $('#title').val(), datePosted: $('#date-posted').val(), askingPrice: $('#asking-price').val()}
    })
    .then((response) => {
      renderListings(response)
    });
  });
});
