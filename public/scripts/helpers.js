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
};

//This function creates an HTML element with the an item from listings.
const createListingElement = function(listingObject) {
  let postedListing = $(`

  <div class="card listing-container col-4">
    <img src="${escape(listingObject.thumbnail_url)}" class="card-img-top" alt="Bananas">
    <div class="card-body">
      <h5 class="card-title title">${escape(listingObject.title)}</h5>
      <div class="d-flex justify-content-between">
        <h6 class="card-subtitle mb-2 text-muted asking-price price">$ ${escape(listingObject['asking_price'])}</h6>
        <small class="text-muted date-posted posted_at">${timeago.format(listingObject['date_created'])}</small>
      </div>
      <p class="card-text description">${escape(listingObject.long_description)}</p>
      <div class="d-flex justify-content-between">
        <p class="card-text condition"><small class="text-muted">Condition:</small> ${escape(listingObject.condition)}</p>
        <div class="icon-container">
        <div class="sold" id="sold${listingObject.id}"></div>
          <a style="text-decoration:none" id="favorite${listingObject.id}" class="favorite" href="/api/listing/buttons/like/add">🤍</a>
          <a style="text-decoration:none" id="mailbox${listingObject.id}"class="contact" href="/mailbox?lid=${escape(listingObject.id)}&sid=${escape(listingObject.owner_id)}">✉</a>
        </div>
      </div>
    </div>

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

  <div class="card listing-container col-4">
  <img src="${escape(listingObject.thumbnail_url)}" class="card-img-top" alt="">
  <div class="card-body">
    <h5 class="card-title title">${escape(listingObject.title)} (ID: <span class="listing-id">${escape(listingObject.id)})</span></h5>
    <div class="d-flex justify-content-between">
      <h6 class="card-subtitle mb-2 text-muted asking-price price">$ ${escape(listingObject['asking_price'])}</h6>
      <small class="text-muted date-posted posted_at">${timeago.format(listingObject['date_created'])}</small>
    </div>
    <p class="card-text description"></p>
  </div>
  <div class="card-footer d-flex justify-content-between">
    <a style="text-decoration:none" class="sold" id="sold${listingObject.id}" href="/api/listing/buttons/sold">🤝</a>
    <a style="text-decoration:none" class="favorite" id="favorite${listingObject.id}" href="/api/listing/buttons/like/add">🤍</a>
    <a style="text-decoration:none" class="delete" id="delete${listingObject.id}" href="/api/listing/buttons/delete">❌</a>

  </div>
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

// renders a single message element from a message object
const renderMessage = function(messageObj) {
  return `
  <li class="d-flex justify-content-between mb-4">
      <div class="card">
      <div class="card-header d-flex justify-content-between p-3">
        <p class="text-muted small mb-0"><i class="far fa-clock"></i><div class="sent-at">${timeago.format(messageObj.created_at)}</div></p>
      </div>
      <div class="card-body">
        <p class="mb-0">
          ${messageObj.message}
        </p>
      </div>
    </div>
  </li>
  `
};

// empties messages container and pushes rendered messages elements
const renderMessages = function(messages) {
  $('.messages-container').html('');
  for (message of messages) {
    $('.messages-container').prepend(renderMessage(message));
  }
};

// renders HTML for received mail items
const renderReceivedMail = function(mailInfo) {
  return `
  <li class="p-2 border-bottom" style="background-color: #eee;">
    <a href="/mailbox?lid=${escape(mailInfo.id)}&cid=${escape(mailInfo.client_id)}" class="d-flex justify-content-between">
      <div class="pt-1">
        <span class="listing-name fw-bold mb-0">${escape(mailInfo.title)}</span><br>
        Seller id: <span class="small text-muted user-id">${escape(mailInfo.client_id)}</span>
      </div>
    </a>
  </li>
  `
};

// renders HTML for sent mail items
const renderSentMail = function(mailInfo) {
  return `
  <li class="p-2 border-bottom" style="background-color: #eee;">
    <a href="/mailbox?lid=${escape(mailInfo.id)}&sid=${escape(mailInfo.seller_id)}" class="d-flex justify-content-between">
      <div class="pt-1">
        <span class="listing-name fw-bold mb-0">${escape(mailInfo.title)}</span><br>
        Seller id: <span class="small text-muted user-id">${escape(mailInfo.seller_id)}</span>
      </div>
    </a>
  </li>
  `
};

// dynamically pushes rendered HTML elements to respective containers
const renderInboxItems = function(mailItems, mailDir) {
  if (mailDir === 'received') {
    $('.received-queries-container').html('')
    for (item of mailItems) {
      $('.received-queries-container').prepend(renderReceivedMail(item))
    }
  }

  if (mailDir === 'sent') {
    $('.sent-queries-container').html('')
    for (item of mailItems) {
      $('.sent-queries-container').prepend(renderSentMail(item))
    }
  }
};

// automatically pushes user details fetched from getUserFromIdto mailbox page
const writeUserDetails = function(userInfo) {
  const userDetailsString = `
  <h1 class="conversation-with">Conversation with <span class="user-name">${escape(userInfo.name)}</span></h1>
  <p>Phone number: <span class="phone-number">${escape(userInfo.phone)}</span><br>
    e-mail: <span class="email">${escape(userInfo.email)}</span><br>
  </p>
  `

  $('.conversation-with-container').html('').prepend(userDetailsString)

};
