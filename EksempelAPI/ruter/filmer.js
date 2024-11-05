const express = require('express');
const router = express.Router();
const movieController = require('../controllers/filmkontroll');

// Ruter for å håndtere filmer
router.get('/', movieController.getAllMovies);
router.post('/', movieController.addMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
