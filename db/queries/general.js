const db = require('../connection');

// NEW CODE
// function to insert message into messages table
const addMessage = (listing_id, email, message) => {
  const queryString1 = `SELECT name FROM users WHERE email = $1`;
  const queryString2 = `
    INSERT INTO messages (message, listing_id, seller_id, client_id)
    VALUES (
      $3,
      $1,
      (SELECT owner_id FROM listings WHERE id = $1),
      (SELECT id FROM users WHERE email = $2)
    ) returning *;
  `;

// two db queries are used.
// First to get the name of the user who is sending the message.
// Second to insert the message into the messages table
  return db.query(queryString1, [email])
    .then((res) => {
      const name = res.rows[0].name;
      console.log('name', name);
      return db.query(queryString2, [listing_id, email, `${name} says: ${message}`])
    })
    .then(data => {
      return data.rows;
    })
    .catch(error => console.error("error from general.js", error));
};

const getUserByEmail = function(email) {
  //return null if no e-mail is passed in
  if (!email) {
    return null;
  }

  const values = [email];
  //selecting all columns from users entity
  const queryString = `
  SELECT *
  FROM users
  WHERE email = $1;
  `;
  return db.query(queryString, values)
    .then(res => {
      (res.rows[0]);
      return res.rows[0];
    });
};

const getListingsById = (id) => {
  const values = [id]
  const queryString = `
  SELECT * FROM listings
  WHERE id = $1
  AND deleted = 'false'
  ;
  `
    return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

const getListingsByUserId = (userId) => {
  const values = [userId]
  const queryString = `
  SELECT * FROM listings
  WHERE owner_id = $1
  AND deleted = 'false'
  ;
  `
    return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

// receives searchTerms from search bar and returns any matching listings
const getListingsBySearch = (searchFilters, limit) => {

    const values = [];
  let queryString = `
  SELECT listings.*
  FROM listings
  WHERE deleted = 'false'
  `;

  if (searchFilters) {
    if (searchFilters.title && searchFilters.title !== '') {
      values.push(`${searchFilters.title}`);
      queryString += `AND title = $${values.length}`;
    }

    if (searchFilters.askingPrice && searchFilters.askingPrice !== '') {
      values.push(searchFilters.askingPrice);
      queryString += `AND asking_price = $${values.length}`;
    }
  }

  if(limit){
    queryString += `LIMIT ${limit}`;
  }

  queryString += `;`;

  return db
    .query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

const getListingsUpForSale = (searchFilters, limit) => {

  const values = [];
let queryString = `
SELECT listings.*
FROM listings
WHERE deleted = 'false'
AND sold = 'false'
`;

if (searchFilters) {
  if (searchFilters.title && searchFilters.title !== '') {
    values.push(`${searchFilters.title}`);
    queryString += `AND title = $${values.length}`;
  }

  if (searchFilters.askingPrice && searchFilters.askingPrice !== '') {
    values.push(searchFilters.askingPrice);
    queryString += `AND asking_price = $${values.length}`;
  }
}

if(limit){
  queryString += `LIMIT ${limit}`;
}

queryString += `;`;

return db
  .query(queryString, values)
  .then(res => {
    return res.rows;
  });
};


const getFavoritesByUserId = (user_id) => {
  if(!user_id){
    return null
  }
  const values = [user_id];
  const queryString = `
  SELECT *
  FROM favorites
  WHERE user_id = $1
  ;`;

  return db.query(queryString, values)
    .then(data => {
      return data.rows;
    });
};

  /** Fetches conversation as an
   *
   * @param {*} listing_id
   * @param {*} email
   * @returns
   */
  const getConversation = (listing_id, email) => {
    // catch non-logged-in users
    if(!email) return null;
    // set query params to values
    const values = [listing_id, email];

    const queryString = `SELECT message, created_at from messages
    JOIN listings ON listings.id = messages.listing_id
    WHERE listing_id = $1
    AND client_id = (select id from users where email = $2);`;

    return db.query(queryString, values)
      .then(data => data.rows)
      .catch(error => console.error(error));
  };

const addUser = function(newUser) {
  //if information is not provided return null
  if (!newUser.Name || !newUser.email || !newUser.password || !newUser['phone-number'] || !newUser.city) {
    return null;
  }
  let timeStamp = new Date
  const values = [newUser.Name, newUser.email, newUser.password, newUser['phone-number'], newUser.city, timeStamp];
  //insert a new user into users entity and return an object with the new user's information
  const queryString = `
  INSERT INTO users (
    name,
    email,
    password,
    phone,
    city,
    created_at
    )
    VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
    )
    RETURNING *;`;
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

const addListing = function(newListing) {
  //if information is not provided return null
  if (!newListing.title || !newListing.description || !newListing.condition || !newListing['asking-price'] || !newListing['thumbnail-url'] || !newListing.photos, !newListing.owner_id) {
    return null;
  }

  let timeStamp = new Date
  const values = [newListing.title, newListing.description, timeStamp, newListing.condition, newListing['thumbnail-url'], newListing.owner_id, newListing['asking-price']];
  //insert a new listing into listings entity and return an object with the new information
  const queryString = `
  INSERT INTO listings (
    title,
    long_description,
    date_created,
    condition,
    thumbnail_url,
    owner_id,
    asking_price
    )
    VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
    )
    RETURNING *;`;
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

const addFavorite = function(userId, listingId) {
  //if information is not provided return null
  if (!userId || !listingId) {
    return null;
  }

  const values = [userId, listingId];
  const queryString = `
  INSERT INTO favorites (
    user_id,
    listing_id
    )
    VALUES (
    $1,
    $2
    )
    RETURNING *;`;
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

const deleteFavorite = function(userId, listingId) {
  //if information is not provided return null
  if (!userId || !listingId) {
    return null;
  }

  const values = [userId, listingId];
  const queryString = `
  DELETE FROM favorites
  WHERE user_id = $1
  AND listing_id = $2
  ;`;

  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

const addPhotos = function(photos) {
  //if information is not provided return null
  if (!photos.listing_id || !photos.url) {
    return null;
  }

  const values = [photos.listing_id, photos.url];
  //insert a new photo into photos entity and return an object with the new information
  const queryString = `
  INSERT INTO photos (
    listing_id,
    url
    )
    VALUES (
    $1,
    $2
    )
    RETURNING *;`;
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

const setItemToSold = function(listingId) {
  //if information is not provided return null
  if (!listingId) {
    return null;
  }

  const values = [listingId, true];
  const queryString = `
  UPDATE listings
  SET sold = $2
  WHERE id = $1
  RETURNING *;`;

  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

const setItemToNotSold = function(listingId) {
  //if information is not provided return null
  if (!listingId) {
    return null;
  }

  const values = [listingId, false];
  const queryString = `
  UPDATE listings
  SET sold = $2
  WHERE id = $1
  RETURNING *;`;

  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

const deleteItem = function(listingId) {
  //if information is not provided return null
  if (!listingId) {
    return null;
  }

  const values = [listingId, true];
  const queryString = `
  UPDATE listings
  SET deleted = $2
  WHERE id = $1
  RETURNING *;`;

  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

module.exports = {
  // NEW CODE
  addMessage,
  addUser,
  addListing,
  addPhotos,
  getListingsById,
  getListingsByUserId,
  getUserByEmail,
  getListingsBySearch,
  getListingsUpForSale,
  getFavoritesByUserId,
  addFavorite,
  deleteFavorite,
  deleteItem,
  setItemToSold,
  setItemToNotSold,
  getConversation
};
