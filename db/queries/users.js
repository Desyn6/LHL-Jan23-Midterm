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

const getListingsById = (user_id) => {
  return db.query(`SELECT * FROM listings where id = ${user_id};`)
    .then(data => {
      return data.rows;
    });
};

// multi use function, can return listings by listin_di, owner_id, min_price, max_price
const getAllListings = (options, limit = 10) => {
  const queryParams = [];
  const queryString = `
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
const getListingsBySearch = (searchTerms) => {
  const values = [`%${searchTerms}%`];
  const queryString = `
  SELECT * FROM listings
  WHERE title ILIKE $1;
  `;
  return db.query(queryString, values)
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      console.log('Error', err);
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

  const values = [newUser.Name, newUser.email, newUser.password, newUser['phone-number'], newUser.city];
  //insert a new user into users entity and return an object with the new user's information
  const queryString = `
  INSERT INTO users (
    name, 
    email, 
    password,
    phone,
    city
    ) 
    VALUES (
    $1, 
    $2, 
    $3,
    $4,
    $5
    )
    RETURNING *;`;
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

module.exports = {
  addUser,
  getUsers,
  getListingsById,
  getUserByEmail,
  getAllListings,
  getListingsBySearch,
  getFavoritesById,
  getPhotos,
  getConversation
};
