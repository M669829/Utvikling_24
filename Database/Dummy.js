const Database = require('better-sqlite3');
const db = new Database('StudieTidDatabase1.db');

// Sett inn dummy-data
try {
  // 1. Sett inn data i Fag-tabellen
  db.prepare(`INSERT INTO Fag (fagkode, Fagnavn) VALUES (?, ?)`).run('MAT101', 'Matematikk');
  db.prepare(`INSERT INTO Fag (fagkode, Fagnavn) VALUES (?, ?)`).run('NAT101', 'Naturfag');
  db.prepare(`INSERT INTO Fag (fagkode, Fagnavn) VALUES (?, ?)`).run('ANN101', 'Annet');

  // 2. Sett inn data i Bruker-tabellen
  db.prepare(`INSERT INTO Bruker (epost, Fornavn, Etternavn, Adminrolle, profilbilde, Passord) VALUES (?, ?, ?, ?, ?, ?)`)
    .run('admin@eksempel.no', 'Ola', 'Nordmann', 1, 'admin_pic.png', 'adminpass123');
  db.prepare(`INSERT INTO Bruker (epost, Fornavn, Etternavn, Adminrolle, profilbilde, Passord) VALUES (?, ?, ?, ?, ?, ?)`)
    .run('bruker@eksempel.no', 'Kari', 'Helene', 0, 'bruker_pic.png', 'userpass123');

  // 3. Sett inn data i Rom-tabellen
  db.prepare(`INSERT INTO Rom (Romnavn) VALUES (?)`).run('303');
  db.prepare(`INSERT INTO Rom (Romnavn) VALUES (?)`).run('401');
  db.prepare(`INSERT INTO Rom (Romnavn) VALUES (?)`).run('501');

  // 4. Sett inn data i Status-tabellen
  db.prepare(`INSERT INTO Status (Statusnavn) VALUES (?)`).run('godkjent');
  db.prepare(`INSERT INTO Status (Statusnavn) VALUES (?)`).run('avvist');
  db.prepare(`INSERT INTO Status (Statusnavn) VALUES (?)`).run('avventer godkjenning');

  // 5. Sett inn data i Studietid-tabellen
  db.prepare(`
    INSERT INTO Studietid (brukerID, fagID, romID, Dato, StatusID) 
    VALUES (?, ?, ?, ?, ?)
  `).run('admin@eksempel.no', 'MAT101', 1, '2024-11-05', 1);  // Godkjent studietid for admin i Matematikk i rom 303
  db.prepare(`
    INSERT INTO Studietid (brukerID, fagID, romID, Dato, StatusID) 
    VALUES (?, ?, ?, ?, ?)
  `).run('bruker@eksempel.no', 'NAT101', 2, '2024-11-06', 3);  // Avventer godkjenning for bruker i Naturfag i rom 401
  db.prepare(`
    INSERT INTO Studietid (brukerID, fagID, romID, Dato, StatusID) 
    VALUES (?, ?, ?, ?, ?)
  `).run('bruker@eksempel.no', 'ANN101', 3, '2024-11-07', 2);  // Avvist studietid for bruker i Annet i rom 501

  console.log('Dummy-data ble lagt til i alle tabeller.');
} catch (error) {
  console.error('Error inserting data:', error.message);
} finally {
  db.close();
}
