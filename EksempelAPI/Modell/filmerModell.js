const db = require('../Database/db');


// Hent alle filmer
exports.getAll = () => {
    return db.prepare('SELECT * FROM movies').all();
};

// Legg til en ny film

exports.create = (title, director) => {
    db.prepare('INSERT INTO movies (title, director) VALUES (?, ?)').run(title, director);
};

// Slett en film
exports.delete = (id) => {
    db.prepare('DELETE FROM movies WHERE id = ?').run(id);
};
