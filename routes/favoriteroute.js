//favoriteroute,js
const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');

// Get all favourites for a user
router.get('/:userId', favouriteController.getFavourites);

// Add a product to favourites
router.post('/:userId/add', favouriteController.addFavourite);

// Remove a product from favourites
router.delete('/:userId/remove', favouriteController.removeFavourite);

module.exports = router;
