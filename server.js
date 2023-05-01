// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();
const cookieSession = require('cookie-session');

app.set('view engine', 'ejs');


//this app.use allows express to use required packages
app.use(cookieSession({
  name: 'session',
  keys: ['tea'],
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
const userApiRoutes = require('./routes/users-api');
const searchApiRoutes = require('./routes/search-api');
const userListingsApiRoutes = require('./routes/listings-api');
const listingButtonsApiRoutes = require('./routes/listing-buttons-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const loginRouts = require('./routes/login');
const registerRouts = require('./routes/register');
const listingsRouts = require('./routes/listings');
const mailboxRouts = require('./routes/mailbox');
const mailboxApiRoutes = require('./routes/mailbox-api');

// Mount all resource routes
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/search', searchApiRoutes);
app.use('/api/listings', userListingsApiRoutes);
app.use('/api/listing/buttons', listingButtonsApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/api/mailbox', mailboxApiRoutes);
app.use('/users', usersRoutes);
app.use('/login', loginRouts);
app.use('/register', registerRouts);
app.use('/listings', listingsRouts);
app.use('/mailbox', mailboxRouts);

// Note: mount other resources here, using the same pattern above
// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  const templateVars = { user: req.session.userInfo };
  res.render('index', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
