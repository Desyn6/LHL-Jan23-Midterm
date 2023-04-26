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
$(() => {

  $('#search_form').submit((event) => {
    event.preventDefault()


       
    const title = $('#title').val()
    const datePosted = $('#date-posted').val()
    const askingPrice = $('#asking-price').val()

    $.ajax({
      method: 'post', 
      url: '/api/users/search',
      data: {1: $('#title').val()}
    })
      .then((response) => {
        console.log('jquery response', response)
        $('#div').empty();
        $('#div').append($(`<div>140</div>`));
      })

  });
});
