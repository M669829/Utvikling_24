const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const {
    genererKortstokk,
    blandKortstokk,
    trekkKort,
    beregnVerdi,
    erBust,
    dealerTrekk,
    bestemVinner,
    erBlackjack,
} = require("./bjfunksjoner.js");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "Front"))); // Statiske filer fra "Front"

// Spillets tilstand
let kortstokk = [];
let spillerHand = [];
let dealerHand = [];
let spillerSaldo = 1000; // Startsaldo for spilleren
let aktivInnsats = 0; // Nåværende innsats
let spillAvsluttet = true; // Start som avsluttet

// Start ny runde
app.post("/start", (req, res) => {

    if (aktivInnsats <= 0) {
        return res.status(400).json({ melding: "Du må sette en innsats før du starter!" });
    }
    if (aktivInnsats > spillerSaldo) {
        return res.status(400).json({ melding: "Saldo for liten, fyll på eller stopp å spille" });
    }

    console.log(spillerSaldo)
    spillerSaldo -= aktivInnsats;
    console.log(spillerSaldo)

    kortstokk = blandKortstokk(genererKortstokk());
    spillerHand = [trekkKort(kortstokk), trekkKort(kortstokk)];
    dealerHand = [trekkKort(kortstokk), trekkKort(kortstokk)];
    spillAvsluttet = false;
    Spillerverdi = beregnVerdi(spillerHand)
    Dealerverdi = beregnVerdi([dealerHand[0]]);

    if (erBlackjack(spillerHand) && !erBlackjack(dealerHand)) {
        spillAvsluttet = true;
        spillerSaldo += aktivInnsats*2.5;
        console.log("bj :" + spillerSaldo)
        res.json({
            melding: "Blackjack! Spiller vinner",
            spillerHand,
            dealerSynlig: dealerHand[0],
            Spillerverdi,
            Dealerverdi,
            saldo: spillerSaldo,
            innsats: aktivInnsats,
        })
    } else {
    res.json({
        melding: "Ny runde startet!",
        spillerHand,
        dealerSynlig: dealerHand[0],
        Spillerverdi,
        Dealerverdi,
        saldo: spillerSaldo,
        innsats: aktivInnsats
    });}
});

// Spilleren trekker kort
app.post("/trekke", (req, res) => {
    if (spillAvsluttet) {
        return res.json({ melding: "Spillet er avsluttet. Start en ny runde." });
    }

    spillerHand.push(trekkKort(kortstokk));
    Spillerverdi = beregnVerdi(spillerHand)
    if (erBust(spillerHand)) {
        spillAvsluttet = true;
        return res.json({
            melding: "Du er bust! Dealer vinner. Du tapte: "+ aktivInnsats + "kr" ,
            spillerHand,
            Spillerverdi,
            saldo: spillerSaldo,
        });
    } else {

    res.json({
        melding: "Du trakk et kort.",
        spillerHand,
        Spillerverdi

    });}
});

// Spilleren står
app.post("/staa", (req, res) => {
    if (spillAvsluttet) {
        return res.json({ melding: "Spillet er avsluttet. Start en ny runde." });
    }

    dealerTrekk(kortstokk, dealerHand);
    const resultat = bestemVinner(spillerHand, dealerHand,aktivInnsats);
    spillAvsluttet = true;
    Spillerverdi = beregnVerdi(spillerHand)
    Dealerverdi = beregnVerdi(dealerHand);
    console.log(spillerSaldo)
    spillerSaldo += resultat.innsats;
    console.log(spillerSaldo)

    res.json({
        melding: resultat.medling,
        spillerHand,
        dealerHand,
        Spillerverdi,
        Dealerverdi,
        saldo: spillerSaldo
    });
});

app.post("/settInnsats", (req, res) => {
    const innsats = req.body.innsats;

    // Valider innsatsen
    if (innsats > spillerSaldo) {
        return res.status(400).json({ melding: "Ikke nok saldo!" });
    }
    if (innsats <= 0) {
        return res.status(400).json({ melding: "Innsats må være større enn null!" });
    }

    // Oppdater innsatsen
    aktivInnsats = innsats;

    res.json({
        melding: `Innsats på ${innsats} plassert.`,
        saldo: spillerSaldo,
        innsats: aktivInnsats
    });
});



// Start server
app.listen(port, () => {
    console.log(`Blackjack-server kjører på http://localhost:${port}`);
});

