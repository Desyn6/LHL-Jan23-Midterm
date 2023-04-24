const db = require('../connection');

/**
 * Adds a new user to the database.
 * @param {{name: string, email: string, password: string, phone: string, city: string}} user - The data for the new user.
 * @returns {Promise<object>} The newly created user object, or an error.
 */
const registerUser = (user) => {
    const values = [user.name, user.email, user.password, user.phone, user.city];
    const queryString = `
        INSERT INTO users(
            name,
            email,
            password,
            phone,
            city
        )
        VALUES ($1, $2, $3, $4, $5);
    `;
    return db.query(queryString, values)
        .then((result) => result.rows[0])
        .catch((err) => console.log(err.message))
};




// ************ not completed ********** ///

const updateUser = (options) => {
    const queryParams = [];
    const queryString = `
    UPDATE users 
    `;
    if (options.) {
        queryParams.push(`%${options.}%`);
        queryString += `SET name = $${queryParams.length} `;
      }
};
