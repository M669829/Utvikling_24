const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const hbs = require('hbs');

const app = express(); // 
const db = new sqlite3.Database('./Testv1', (err) => {
    if (err) {
        console.error('Kunne ikke åpne databasen:', err.message);
    } else {
        console.log('Koblet til SQLite-databasen Testv1.db');
    }
});



const publicvei = path.join(__dirname, "/public");

app.use(express.static(publicvei)); //Midddelware 
app.use(express.urlencoded({ extended: true })); //Middelware for å håndtere Post-data
app.use(express.json()); //Middelware for å håndtere json-data
app.set('view engine','hbs');


app.listen(3000, () => {
    console.log('Server is running on port 3000')
});

const data = [
    { id: 1, message: "Melding 1" },
    { id: 2, message: "Melding 2" }
];

app.get('/', (req,res) => {
    res.sendFile(path.join(publicvei, 'test.html'));
})

app.get('/skjema',(req, res) => {
    res.sendFile(path.join(publicvei, 'skjema.html'))})



app.post('/send-data', (req, res) => {
   
    const { name, email } = req.body;

    console.log(`Mottatt data - Navn: ${name}, Epost: ${email}`);

    res.send(`<h1>Takk, ${name}! Vi har mottatt din epost: ${email}</h1>
        <button onclick="window.location.href='/'">Tilbake til start</button>`);
       

})

app.get('/del', (req, res) => {
    console.log("Deleting: " + req.query.id);
});

app.get('/view', (req, res) => {
    console.log("id: " + req.query.id);
    console.log("name: " + req.query.name);
});

app.get('/test',(req,res) => {
    res.sendFile(path.join(publicvei, 'leggtil.html'));
})

app.get('/getData', (req, res) => {
    res.send(data);
});

app.post('/add-kunde', (req, res) => {
    const { navn, epost, alder } = req.body;

    if (!navn || !epost || !alder) {
        return res.status(400).send('Alle felter er påkrevd');
    }

    const query = `INSERT INTO Kunde (Navn, Epost, Alder) VALUES (?, ?, ?)`;
    db.run(query, [navn, epost, alder], (err) =>  {
        if (err) {
            return res.status(500).send('Database-feil: ' + err.message);
        }
        // Tilbakemelding etter at kunden er lagt til
        res.send(`<h1>Kunde lagt til med ID: ${this.lastID}</h1><button onclick="window.location.href='/'">Tilbake til start</button>`);
    });
});


app.get('/get-kunder', (req, res) => {
    const query = `SELECT * FROM Kunde`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Database-feil: ' + err.message);
        }
        res.json(rows); // Returnerer kundene som JSON
    });
});



