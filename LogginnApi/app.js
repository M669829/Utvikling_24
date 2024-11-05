const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Middleware for å parse innkommende POST-data
app.use(express.urlencoded({ extended: true }));

// Sett opp session
app.use(session({
    secret: 'my_secret_key', // Bytt ut med en sikker nøkkel i produksjon
    resave: false,
    saveUninitialized: true
}));

// Gjør public-mappen tilgjengelig
app.use(express.static(path.join(__dirname, 'public')));

// Dummy data for innlogging (hardkodet brukernavn og passord)
const myusername = 'birger';
const mypassword = '123';

// Rute for å vise innloggingssiden (login.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Håndter innlogging
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Sjekk brukernavn og passord
    if (username === myusername && password === mypassword) {
        req.session.loggedIn = true;
        req.session.username = username; // Lagrer brukernavn i session

        // Lagre brukernavn i sessionStorage via en redirect
        res.send(`
            <script>
                sessionStorage.setItem('username', '${username}');
                window.location.href = '/velkommen';
            </script>
        `);
    } else {
        req.session.loggedIn = false;
        res.redirect('/login');
    }
});

// Beskyttet rute som krever innlogging (velkommen.html)
app.get('/velkommen', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    res.sendFile(path.join(__dirname, 'public', 'velkommen.html'));
});

// Rute for å logge ut
app.get('/logout', (req, res) => {
    req.session.destroy(); // Ødelegger sessionen
    res.redirect('/');
});

// Start serveren
app.listen(3000, () => {
    console.log('Serveren kjører på http://localhost:3000');
});
