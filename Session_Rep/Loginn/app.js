const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Dummy brukere (i en ekte app brukes database)
const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "Marius", password: "user123", role: "user" }
];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'hemmeligNøkkel',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, "Front"))); // Serverer HTML-filene


// Innlogging
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user.username; 
        req.session.role = user.role;
        res.redirect("/bruker"); // Send brukeren til startsiden
    } else {
        res.send("<h2>Feil brukernavn eller passord</h2><a href='/login.html'>Prøv igjen</a>");
    }
});

// Start side

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "Front/velkommen.html"))
})

app.get("/logginn", (req,res) => {
    res.sendFile(path.join(__dirname, "Front/logginn.html"))
})

// Hent brukerinfo
app.get("/user", (req, res) => {
    if (!req.session.user) {
        return res.json({ username: null });
    }
    res.json({ username: req.session.user });
});

// Beskyttet velkomstside
app.get("/bruker", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/logginn");
    }
    res.sendFile(path.join(__dirname, "Front/bruker.html"));
});

// Beskyttet admin-side
app.get("/admin", (req, res) => {
    if (!req.session.user || req.session.role !== "admin") {
        return res.status(403).send("<h2>Ingen tilgang</h2><a href='/'>Tilbake</a>");
    }
    res.sendFile(path.join(__dirname, "Front/admin.html"));
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send("Kunne ikke logge ut.");
        }
        res.redirect("/");
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});
