
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Sett opp session
app.use(session({
    secret: 'hemmeligNøkkel',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // secure: true krever HTTPS
}));

// Server statiske filer (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'Public')));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "Public/index.html"))

})

// Hent handlekurven som JSON
app.get('/cart', (req, res) => {
    res.json({ cart: req.session.cart || [] });
    console.log(req.session.cart)
});


// Legg til varer i handlekurven
app.post('/add-to-cart', (req, res) => {
    const item = req.body.item;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push(item);
    res.redirect('/');
});

// Tøm handlekurven
app.post('/clear-cart', (req, res) => {
    req.session.cart = [];
    res.redirect('/');
});



// Start serveren
app.listen(5000, () => console.log('Server kjører på http://localhost:5000'));
