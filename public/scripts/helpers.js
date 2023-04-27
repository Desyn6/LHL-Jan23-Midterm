//The escape function converts html tags to unrecognizable code but when it's posted it is translated back to what it was to be safely viewed. This prevents html malware injections
//the escape function is used inside the createListingElement() function
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//This function creates an HTML element with the an item from listings.
const createListingElement = function(listingObject) {
  let postedListing = $(`
  <div class="listing-container">
    <header>
      <div class="title">${escape(listingObject.title)}</div>
      <div class="price">${escape(listingObject['asking_price'])}</div>
    </header>
    <img src="${escape(listingObject['thumbnail-url'])}" alt="">
    <footer>
      <div class="posted_at">${timeago.format(listingObject['date_created'])}</div>
      <div class="favorite">☆</div>
      <div class="contact">✉</div>
    </footer>
  </div>
    `
  );
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

//this function takes in an array of objects(coming from the getListingsBySearch function)
const renderListings = function(listingsObjectArr) {
  if(listingsObjectArr == 'item not found' || listingsObjectArr.length === 0){
    $('.appending_listings_container').empty();
    $('.appending_listings_container').append(itemNotFound);
    return
  }
  
    $('.appending_listings_container').empty();
      
    //loop though array of objects containing listings info
    for (let i of listingsObjectArr) {
      let postListing = createListingElement(i)
      $('.appending_listings_container').prepend(postListing);
    }
};
