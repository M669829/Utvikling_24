const Movie = require('../Modell/filmerModell');

// Henter alle filmer
exports.getAllMovies = (req, res) => {
    const movies = Movie.getAll();
    res.json(movies);
};

// Legger til en ny film
exports.addMovie = (req, res) => {
    const { title, director } = req.body;
    Movie.create(title, director);
    res.status(201).json({ success: "Film lagt til!" });
};

// Sletter en film
exports.deleteMovie = (req, res) => {
    const id = req.params.id;
    Movie.delete(id);
    res.json({ success: "Film slettet!" });
};


