const db = require('../connection');

//This function gets all info from users table
const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
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
  SELECT * FROM listings where id = $1;
  `
    return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

const getListingsByUserId = (userId) => {
  const values = [userId]
  const queryString = `
  SELECT * FROM listings where owner_id = $1;
  `
    return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

// multi use function, can return listings by listin_di, owner_id, min_price, max_price
const getAllListings = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT * FROM listings
  WHERE 1 = 1`;
  // return listings by listing_id
  if (options.id) {
    queryParams.push(`%${options.id}%`);
    queryString += `AND id $${queryParams.length} `;
  }
  // given owner_id return properties belonging to that owner
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length} `;
  }
  // return listings >= min price search parameter
  if (options.minimum_price) {
    queryParams.push(options.minimum_price);
    queryString += `AND asking_price >= $${queryParams.length} `;
  }
  // return listings <= max price search parameter
  if (options.maximum_price) {
    queryParams.push(`${options.maximum_price} `);
    queryString += `AND asking_price <= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  LIMIT $${queryParams.length};`;

  return db.query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// receives searchTerms from search bar and returns any matching listings
const getListingsBySearch = (searchFilters) => {
  
    const values = [];
  let queryString = `
  SELECT listings.*, photos.url as "thumbnail-url"
  FROM listings
  JOIN photos ON listings.id = photos.listing_id
  WHERE 1 = 1
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
  
  queryString += `;`;
  
  return db
    .query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

const getFavoritesById = (user_id) => {
  return db.query(`SELECT * FROM listings where id = ${user_id};`)
    .then(data => {
      return data.rows;
    });
};
// returns the url for the specified listing id.
const getPhotos = (listing_id) => {
  return db.query(`SELECT url FROM photos where listing_id = ${listing_id};`)
    .then(data => {
      return data.rows;
    });
};

const getConversation = (listing_id, seller_id, client_id) => {
  const values = [listing_id, seller_id, client_id];
  const queryString = `
  SELECT * FROM messages
  WHERE listing_id = $1
  AND seller_id = $2
  AND client_id = $2;`;
  return db.query(queryString, values)
    .then(data => {
      return data.rows;
    });
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

module.exports = {
  addUser,
  addListing,
  addPhotos,
  getUsers,
  getListingsById,
  getListingsByUserId,
  getUserByEmail,
  getAllListings,
  getListingsBySearch,
  getFavoritesById,
  getPhotos,
  getConversation
};
