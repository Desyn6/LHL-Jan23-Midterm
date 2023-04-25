const db = require('../connection');

/**
 * Creates a new listing in the database.
 *
 * @param {{ title: string, description: string, condition: string, asking_price: number, thumbnail_url: string, photos: string[] }} listing - The data for the new listing.
 * @returns {Promise<object>} The newly created listing object, or an error.
 */
const createListing = (listing) => {
  const values = [
    listing.title,
    listing.description,
    listing.condition,
    listing.asking_price,
    listing.thumbnail_url,
    listing.photos
  ];
  const queryString = `
    INSERT INTO listings(
      title,
      description,
      condition,
      asking_price,
      thumbnail_url,
      photos)
    VALUES($1, $2, $3, $4, $5, $6)
    `;
  return db.query(queryString, values)
    .then((result) => result.rows[0])
    .catch((err) => console.log(err.message));
};

/**
 * Updates the asking price of a listing in the database with the given id.
 * @param {number} newPrice - The new asking price of the listing.
 * @param {number} id - The id of the listing to update.
 * @returns {Promise<object>} A promise that resolves with the updated listing object, or an error.
 */
const updateListingPrice = (newPrice, id) => {
  const values = [newPrice, id];
  const queryString = `
      UPDATE listings
      SET asking_price = $1
      WHERE id = $2;
  `;
  return db.query(queryString, values)
    .then((result) => result.rows[0])
    .catch((err) => console.log(err.message));
};

/**
 * Marks a listing as sold in the database.
 * @param {number} id - The ID of the listing to mark as sold.
 * @returns {Promise<object>} The updated listing object, or an error.
 */
const soldListing = (id) => {
  const queryString = `
    UPDATE listings
    SET sold = true
    WHERE id = ${id};
  `;
  return db.query(queryString)
    .then((result) => result.rows[0])
    .catch((err) => console.log(err.message));
};

/**
 * Marks a listing as deleted in the database.
 * @param {number} id - The ID of the listing to mark as deleted.
 * @returns {Promise<object>} The updated listing object, or an error.
 */
const removeListing = (id) => {
  const values = [id];
  const queryString = `
    UPDATE listings
    SET delete = true
    WHERE id = $1;
  `;
  return db.query(queryString, values)
    .then((result) => result.rows[0])
    .catch((err) => err.message);
};

module.exports = {
  createListing,
  updateListingPrice,
  soldListing,
  removeListing
};
