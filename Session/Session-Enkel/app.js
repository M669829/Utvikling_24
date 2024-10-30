const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');   

app.use(session({
    secret: 'hemmelig_nøkkel',
    resave: false,
    saveUninitialized: true,
    cookie: {

        maxAge: 15*1*1000, // 15 minutter levetid
        httpOnly: true,
        secure: false
    }
  }));

  app.use(express.urlencoded({ extended: true })); // for å hpndtere post metoden

const myusername = 'birger';
const mypassword = '123';

app.get('/', (req,res) => {
    if (req.session.loggedIn === true) {
        res.sendFile(path.join(__dirname,'start.html'));}
    else {
        res.sendFile(path.join(__dirname, 'logginn.html'))
    }
})

app.get('/logginn', (req, res) => {
    res.sendFile(path.join(__dirname, 'logginn.html')); 
  });

app.post('/login', (req,res) =>{
    const { username, password } = req.body;
  
    // Sjekk brukernavn og passord
    if (username === myusername && password === mypassword) {
      req.session.loggedIn = true;
      // req.session.userid = username; // Lagre brukernavn i session
      res.redirect('/');
    } else {
      req.session.loggedIn = false;
      res.redirect('/logginn');
    }
} )

app.listen(3000, () => {
    console.log('Serveren kjører på http://localhost:3000');
  });