const express = require('express');
const router = express.Router();
const path = require('path')

const {hash, sammenlign} = require("./krypter")
const {getbruker, oppdaterbruker, opprettbruker} = require("./database")

const publicvei = path.join(__dirname, 'Front')

//logginnside
router.get('/logginn', (req,res) => {
    res.sendFile(path.join(publicvei,'logginn.html'));
    })

//loggoutknapp
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Feil ved utlogging');
        res.redirect('/auth/logginn');
    });
});

router.post('/logginn', (req, res) => {
    const { username, password } = req.body;
    console.log("1")
    // Sjekk om brukeren eksisterer i databasen
    bruker = getbruker(username)
    
    console.log(bruker)

    if (bruker) {
        if (sammenlign(password, bruker.Passord)) {
            // Hvis innlogging er vellykket, lagre brukerinfo i session
            req.session.loggedIn = true;
            req.session.brukerId = bruker.id;
            req.session.username = bruker.Navn;
            req.session.saldo = bruker.Saldo;
            req.session.email = bruker.Epost
            // Returner JSON-respons som JavaScript forventer
            res.json({ success: true, redirect: '/' });
        } else {
            // Returner feil hvis passordet er feil
            res.json({ success: false, message: 'Feil passord. Vennligst prøv igjen.' });
        }
    } else {
        // Returner feil hvis brukeren ikke finnes
        res.json({ success: false, message: 'Bruker ikke funnet.' });
    }
});

router.get('/hentsaldo', (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ message: "Du må være logget inn for å hente saldo." });
    }

    res.json({ saldo: req.session.saldo });
});


module.exports = router;