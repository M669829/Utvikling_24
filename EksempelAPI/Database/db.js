const sqlite3 = require('better-sqlite3');
const db = sqlite3('Database/filmer.db', { verbose: console.log });

// Opprett en tabell hvis den ikke eksisterer
db.prepare(`
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        director TEXT NOT NULL
    )
`).run();

module.exports = db;
