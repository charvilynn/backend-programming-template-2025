const express = require('express');

const books = require('./components/books/books-route');
const users = require('./components/users/users-route');
const gacha = require('./gacha/gacha-routes');

module.exports = () => {
  const app = express.Router();

  // routes lama
  books(app);
  users(app);

  // route gacha
  app.use('/gacha', gacha);

  return app;
};
