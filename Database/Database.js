const Database = require('better-sqlite3');
const db = new Database('StudieTidDatabase1.db');

// Opprett tabeller
try {
  // Tabell: Bruker
  db.prepare(`
    CREATE TABLE IF NOT EXISTS Bruker (
      epost TEXT PRIMARY KEY,
      Fornavn TEXT NOT NULL,
      Etternavn TEXT NOT NULL,
      Adminrolle INTEGER NOT NULL,
      profilbilde TEXT,
      Passord TEXT NOT NULL
    )
  `).run();

  // Tabell: Fag
  db.prepare(`
    CREATE TABLE IF NOT EXISTS Fag (
      fagkode TEXT PRIMARY KEY,
      Fagnavn TEXT NOT NULL
    )
  `).run();

  // Tabell: Rom
  db.prepare(`
    CREATE TABLE IF NOT EXISTS Rom (
      rom_id INTEGER PRIMARY KEY AUTOINCREMENT,
      Romnavn TEXT NOT NULL
    )
  `).run();

  // Tabell: Status
  db.prepare(`
    CREATE TABLE IF NOT EXISTS Status (
      Statusid INTEGER PRIMARY KEY AUTOINCREMENT,
      Statusnavn TEXT NOT NULL
    )
  `).run();

  // Tabell: Studietid
  db.prepare(`
    CREATE TABLE IF NOT EXISTS Studietid (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      brukerID TEXT NOT NULL,
      fagID TEXT NOT NULL,
      romID INTEGER NOT NULL,
      Dato TEXT NOT NULL,
      StatusID INTEGER NOT NULL,
      FOREIGN KEY (brukerID) REFERENCES Bruker(epost),
      FOREIGN KEY (fagID) REFERENCES Fag(fagkode),
      FOREIGN KEY (romID) REFERENCES Rom(rom_id),
      FOREIGN KEY (StatusID) REFERENCES Status(Statusid)
    )
  `).run();

  console.log('Alle tabellene ble opprettet.');
} catch (error) {
  console.error('Error creating tables:', error.message);
} finally {
  db.close();
}
