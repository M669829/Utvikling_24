const express = require('express');
const app = express();
const path = require('path');
const movieRoutes = require('./ruter/filmer');
const config = require('./config/config');

// Middleware for å håndtere JSON og URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Statisk filserver for frontend-filer
app.use(express.static(path.join(__dirname, 'public')));


// API-ruter
app.use('/api/movies', movieRoutes);


app.listen(config.port, () => {
    console.log(`Server kjører på http://localhost:${config.port}`);
})

/**
 * Start server
 * @pararm {number] port nummer, fra config}
 */


