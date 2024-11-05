const express = require('express');
const session = require('express-session');
//const bcrypt = require('bcrypt'); // For hashing av passord
const sqlite3 = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const db = sqlite3('Session', {verbose : console.log})

const app = express();
const publicvei = path.join(__dirname, '/public')

app.use(session({
    secret: 'din hemmelige nøkkel',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60 * 15 * 1000,
        secure: false,
        httpOnly: true
    } // Set til true hvis du bruker HTTPS
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicvei)); //


function sjekkAdmin(bruker){
    let admin = false;
    const spr = db.prepare('SELECT Adminrolle FROM Brukere WHERE Epost = ?')
    const resultat = spr.get(bruker);

    if (resultat && resultat.Adminrolle) {
        admin = true}
console.log(admin);

return admin;
    
}


function lagreNyBruker(epost,fornavn,etternavn, passord, adminrolle) {
    const saltRounds = 10; // Antall runder med hashing
    const hashedPassword = bcrypt.hashSync(passord, saltRounds);

    // Lagre brukeren i databasen med det hash'ede passordet
    const stmt = db.prepare('INSERT INTO Brukere (Epost, Fornavn, Etternavn, Passord, Adminrolle) VALUES (?, ?, ?,?,?)');
    stmt.run(epost,fornavn,etternavn, hashedPassword, adminrolle);  // Adminrolle er 0 for vanlige brukere, 1 for admin
}

//lagreNyBruker('Bruker@test.no','Hans','Petter','Lottepus123', 0)
//lagreNyBruker('admin@test.no','Kari','Henriksen','Testpassord921', 1)

sjekkAdmin("admin@test.no");
sjekkAdmin("Bruker@test.no");

  app.listen(5000, () => console.log('Server kjører nå på http://localhost:5000'))

app.get('/', async (req, res) => {
        if (req.session.loggedIn && req.session.username) {
            // Sjekker om brukeren er admin
            const isAdmin = sjekkAdmin(req.session.username);  // Forutsetter synkron sjekk
            if (isAdmin) {
                res.redirect('/admin')  // Admin-siden
            } else {
                res.sendFile(path.join('/public', 'start.html')); // Vanlig bruker-side
            }
        } else {
            res.redirect('/logginn');  // Omdirigerer til innlogging hvis brukeren ikke er logget inn
        }
    });

    function adminsjekk(req, res, next) {
     if  (req.session.loggedIn && sjekkAdmin(req.session.username)) {
        nextTick(); 
     } else {
        res.status(403).send('Ikke autorisert')
     }
    }


app.get('/logginn', (req,res) => {
    res.sendFile(path.join(publicvei, 'logginn.html'))
})

app.get('/admin', adminsjekk , (req, res) => {
    res.sendFile(path.join(__dirname, './privat', 'admin.html'));
});



app.post('/logginn', (req, res) => {
    const { username, password } = req.body;

    // Sjekk om brukeren eksisterer i databasen
    const spr = db.prepare('SELECT * FROM Brukere WHERE Epost = ?');
    const bruker = spr.get(username);
console.log(bruker)

    if (bruker) {
        // Sammenlign det oppgitte passordet med det hash'ede passordet i databasen
        const validPassword = bcrypt.compareSync(password, bruker.Passord);

        if (validPassword) {
            // Hvis innlogging er vellykket, lagre brukerinfo i session
            req.session.loggedIn = true;
            req.session.username = bruker.Epost;
            req.session.admin = sjekkAdmin(bruker.Epost);

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








