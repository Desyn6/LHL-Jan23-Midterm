//The escape function converts html tags to unrecognizable code but when it's posted it is translated back to what it was to be safely viewed. This prevents html malware injections
//the escape function is used inside the createListingElement() function
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const buttonListeners = function(selector, listingObject) {
  const favoriteSelector = `#favorite${listingObject.id}`
  const soldSelector = `#sold${listingObject.id}`
  const deleteSelector = `#delete${listingObject.id}`
  const mailBoxSelector = `#mailbox${listingObject.id}`

  if($(`#favorite${listingObject.id}`)) {
    $.ajax({
      method: 'post',
      url: '/api/listing/buttons/like/check',
      data: {listingId: `${listingObject.id}`}
    })
    .then((res) => {
      if(res === 'no logged user'){
        $(favoriteSelector).empty();
        $(mailBoxSelector).empty();
      }
      for(let i of res){
        if(i['listing_id'] === listingObject.id){
          $(favoriteSelector).empty();
          $(favoriteSelector).append('💗');
        }
      }
    })
  }

  $(favoriteSelector, selector).click((event) => {
    const element = $(favoriteSelector, selector)[0].innerHTML
    event.preventDefault()

    if(element === `🤍`){
      $(favoriteSelector).empty();
      $(favoriteSelector).append('💗');

      $.ajax({
        method: 'post',
        url: '/api/listing/buttons/like/add',
        data: {listingId: `${listingObject.id}`}
      })
      .then(() => {
      })
    }

    if(element === `💗`){
      $(favoriteSelector).empty();
      $(favoriteSelector).append('🤍');

      $.ajax({
        method: 'post',
        url: '/api/listing/buttons/like/remove',
        data: {listingId: `${listingObject.id}`}
      })
      .then(() => {
      })
    }
  })

  if($(`#sold${listingObject.id}`)) {
    $.ajax({
      method: 'post',
      url: '/api/listing/buttons/like/check',
      data: {listingId: `${listingObject.id}`}
    })
    .then((res) => {
      if(res === 'no logged user'){
        $(soldSelector).empty();
      }

      for(let i of res){
        if(listingObject.sold){
          $(soldSelector).empty();
          $(soldSelector).append('Item Sold ✅');
        }
      }
    })
  }

  $(soldSelector, selector).click((event) => {
    const element = $(soldSelector, selector)[0].innerHTML
    event.preventDefault()

    if(element === `🤝`){
      $(soldSelector).empty();
      $(soldSelector).append('Item Sold ✅');

      $.ajax({
        method: 'post',
        url: '/api/listing/buttons/sold',
        data: {listingId: `${listingObject.id}`}
      })
      .then(() => {
      })
    }

    if(element === `Item Sold ✅`){
      $(soldSelector).empty();
      $(soldSelector).append('🤝');

      $.ajax({
        method: 'post',
        url: '/api/listing/buttons/not/sold',
        data: {listingId: `${listingObject.id}`}
      })
      .then(() => {
      })
    }
  })

  $(deleteSelector, selector).click((event) => {
    event.preventDefault();

    $.ajax({
      method: 'post',
      url: '/api/listing/buttons/delete',
      data: {listingId: `${listingObject.id}`}
    })
    .then((t) => {
      console.log(t)
    })
    location.reload();
  })
}

//This function creates an HTML element with the an item from listings.
const createListingElement = function(listingObject) {
  let postedListing = $(`
  <div class="listing-container">
    <header>
      <div class="title">${escape(listingObject.title)}</div>
      <div class="price">${escape(listingObject['asking_price'])}</div>
    </header>
    <img src="${escape(listingObject.thumbnail_url)}" alt="">
    <footer>
    <div class="posted_at">${timeago.format(listingObject['date_created'])}</div>
    <div class="sold" id="sold${listingObject.id}"></div>
      <a style="text-decoration:none" id="favorite${listingObject.id}" class="favorite" href="/api/listing/buttons/like/add">🤍</a>
      <a style="text-decoration:none" id="mailbox${listingObject.id}"class="contact" href="/mailbox?lid=${escape(listingObject.id)}">✉</a>
    </footer>
  </div>
    `
  );
  buttonListeners(postedListing, listingObject)
  return postedListing;
};

//This function creates an HTML element with the an item from listings, in case the filter doesn't find any item.
const itemNotFound = function() {
  let postedListing = $(`
  <div class="listing-container">
    Item(s) Not Fount
  </div>
    `
  );
  return postedListing;
};

//this function takes in an array of objects(coming from the getListingsBySearch function and appends listings into home and search pages)
const renderListings = function(listingsObjectArr, idSelector) {
  if(listingsObjectArr == 'item not found' || listingsObjectArr.length === 0){
    $(idSelector).empty();
    $(idSelector).append(itemNotFound);
    return
  }

    $(idSelector).empty();

    //loop though array of objects containing listings info
    for (let i of listingsObjectArr) {
      let postListing = createListingElement(i)
      $(idSelector).prepend(postListing);
    }
};

//This function creates an HTML element with the an item from listings with management privilege.
const createManageListingElement = function(listingObject) {
  let postedListing = $(`
  <div class="listing-container">
    <header>
      <div class="title">${escape(listingObject.title)} (ID: <span class="listing-id">${escape(listingObject.id)})</span></div>
      <div class="price">${escape(listingObject['asking_price'])}</div>
    </header>
    <img src="${escape(listingObject.thumbnail_url)}" alt="">
    <footer>
      <div class="posted_at">${timeago.format(listingObject['date_created'])}</div>
      <a style="text-decoration:none" class="sold" id="sold${listingObject.id}" href="/api/listing/buttons/sold">🤝</a>
      <a style="text-decoration:none" class="favorite" id="favorite${listingObject.id}" href="/api/listing/buttons/like/add">🤍</a>
      <a style="text-decoration:none" class="delete" id="delete${listingObject.id}" href="/api/listing/buttons/delete">❌</a>
    </footer>
  </div>
    `
  );
  buttonListeners(postedListing, listingObject)
  return postedListing;
};

//this function takes in an array of objects(coming from the getListingsBySearch function and appends listings into home and search pages)
const renderManageListings = function(listingsObjectArr, idSelector) {
  if(listingsObjectArr == 'item not found' || listingsObjectArr.length === 0){
    $(idSelector).empty();
    $(idSelector).append(itemNotFound);
    return
  }
    $(idSelector).empty();

    //loop though array of objects containing listings info
    for (let i of listingsObjectArr) {
      let postListing = createManageListingElement(i)
      $(idSelector).prepend(postListing);
    }
};

const renderMessage = function(messageObj) {
  return `<article class="message-container">
      <p>
        ${escape(messageObj.message)}
      </p>
    <div class="sent-at">${timeago.format(messageObj.created_at)}</div>
  </article>`
};

const renderMessages = function(messages) {
  $('.messages-container').html('');
  for (message of messages) {
    $('.messages-container').prepend(renderMessage(message));
  }
};