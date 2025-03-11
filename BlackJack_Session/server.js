//Importer nødvendige moduler
const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser");
const path = require("path");
const logginnrouter = require('./RuteLogginn');
const gamerouter = require('./RuteBlackjack')  
const {
    getbruker, oppdaterbruker, opprettbruker
} = require("./database.js");

//Opprett Express-applikasjon
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "Front"))); // Statiske filer fra "Front"

//Konfigurerer sessions for å huske brukere mellom forespørsler
app.use(session({
    secret: 'hemmeligNøkkel', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Importerer rutene for innlogging og spillet Blackjack
app.use('/auth', logginnrouter);
app.use('/game', gamerouter);

// Startside
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
            res.sendFile(path.join(__dirname,'Front','Blackjack.html'));  // Sørg for at filstien er riktig
        } else {
            // Hvis ikke logget inn, omdiriger til innloggingssiden
            res.redirect('/auth/logginn');
        }
});
// Start server
app.listen(port, () => {
    console.log(`Blackjack-server kjører på http://localhost:${port}`);
});

