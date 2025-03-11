const express = require('express');
const router = express.Router();
const path = require('path')
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
const {
    getbruker, oppdaterbruker, opprettbruker
} = require("./database.js");

router.get("/hentspilletstilstand", (req,res) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ melding: "Du må være logget inn for å hente spilltilstand." });
    }
    if (!req.session.spillerHand || !req.session.dealerHand) {
        return res.json({ aktivtSpill: false, melding: "Ingen aktiv runde." });
    }
    res.json({
        aktivtSpill: true,
        spillerHand: req.session.spillerHand,
        dealerHand: req.session.dealerHand,
        Spillerverdi: beregnVerdi(req.session.spillerHand),
        Dealerverdi: beregnVerdi(req.session.dealerHand),
        saldo: req.session.saldo,
        innsats: req.session.aktivInnsats,
        spillAvsluttet: req.session.spillAvsluttet
    });
});

router.post("/start", async (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ melding: "Du må være logget inn for å spille!" });
    }

    let bruker = getbruker(req.session.email);
    if (!bruker) {
        return res.status(400).json({ melding: "Bruker ikke funnet" });
    }

    if (req.session.spillerHand && !req.session.spillAvsluttet) {
        return res.json({ melding: "Du har allerede en pågående runde!", aktivtSpill: true });
    }

    if (!req.session.aktivInnsats || req.session.aktivInnsats <= 0) {
        return res.status(400).json({ melding: "Du må sette en innsats før du starter!" });
    }

    if (req.session.aktivInnsats > bruker.Saldo) {
        return res.status(400).json({ melding: "Saldo for liten, fyll på eller stopp å spille" });
    }

    req.session.saldo = bruker.Saldo - req.session.aktivInnsats;
    oppdaterbruker(bruker.id, req.session.saldo);

    req.session.kortstokk = blandKortstokk(genererKortstokk());
    req.session.spillerHand = [trekkKort(req.session.kortstokk), trekkKort(req.session.kortstokk)];
    req.session.dealerHand = [trekkKort(req.session.kortstokk), trekkKort(req.session.kortstokk)];
    req.session.spillAvsluttet = false;

    const Spillerverdi = beregnVerdi(req.session.spillerHand);
    const Dealerverdi = beregnVerdi([req.session.dealerHand[0]]);

    if (erBlackjack(req.session.spillerHand) && !erBlackjack(req.session.dealerHand)) {
        req.session.spillAvsluttet = true;
        req.session.saldo += req.session.aktivInnsats * 2.5;
        oppdaterbruker(bruker.id, req.session.saldo);

        return res.json({
            melding: "Blackjack! Spiller vinner",
            spillerHand: req.session.spillerHand,
            dealerSynlig: req.session.dealerHand[0],
            Spillerverdi,
            Dealerverdi,
            saldo: req.session.saldo,
            innsats: req.session.aktivInnsats,
        });
    }

    res.json({
        melding: "Ny runde startet!",
        spillerHand: req.session.spillerHand,
        dealerSynlig: req.session.dealerHand[0],
        Spillerverdi,
        Dealerverdi,
        saldo: req.session.saldo,
        innsats: req.session.aktivInnsats
    });
});

router.post("/trekke", (req, res) => {
    if (req.session.spillAvsluttet) {
        return res.json({ melding: "Spillet er avsluttet. Start en ny runde." });
    }

    req.session.spillerHand.push(trekkKort(req.session.kortstokk));
    const Spillerverdi = beregnVerdi(req.session.spillerHand);

    if (erBust(req.session.spillerHand)) {
        req.session.spillAvsluttet = true;
        return res.json({
            melding: `Du er bust! Dealer vinner. Du tapte: ${req.session.aktivInnsats} kr`,
            spillerHand: req.session.spillerHand,
            Spillerverdi,
            saldo: req.session.saldo,
        });
    }

    res.json({
        melding: "Du trakk et kort.",
        spillerHand: req.session.spillerHand,
        Spillerverdi
    });
});

router.post("/staa", async (req, res) => {
    if (req.session.spillAvsluttet) {
        return res.json({ melding: "Spillet er avsluttet. Start en ny runde." });
    }

    dealerTrekk(req.session.kortstokk, req.session.dealerHand);
    const resultat = bestemVinner(req.session.spillerHand, req.session.dealerHand, req.session.aktivInnsats);
    req.session.spillAvsluttet = true;
    req.session.saldo += resultat.innsats;
    oppdaterbruker(req.session.brukerId, req.session.saldo);

    res.json({
        melding: resultat.medling,
        spillerHand: req.session.spillerHand,
        dealerHand: req.session.dealerHand,
        Spillerverdi: beregnVerdi(req.session.spillerHand),
        Dealerverdi: beregnVerdi(req.session.dealerHand),
        saldo: req.session.saldo
    });
});

router.post("/settInnsats", (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ melding: "Du må være logget inn for å sette innsats." });
    }

    const innsats = parseInt(req.body.innsats, 10);
    
    // Hent bruker fra databasen
    let bruker = getbruker(req.session.email);
    if (!bruker) {
        return res.status(400).json({ melding: "Bruker ikke funnet." });
    }

    // Sørg for at session har riktig saldo
   
    req.session.spillerSaldo = bruker.Saldo;


    // Valider innsatsen
    if (isNaN(innsats) || innsats <= 0) {
        return res.status(400).json({ melding: "Innsats må være et positivt tall!" });
    }
    if (innsats > req.session.spillerSaldo) {
        return res.status(400).json({ melding: "Ikke nok saldo!" });
    }

    // Lagre innsatsen i session
    req.session.aktivInnsats = innsats;

    res.json({
        melding: `Innsats på ${innsats} plassert.`,
        saldo: req.session.spillerSaldo,
        innsats: req.session.aktivInnsats
    });
});





module.exports = router;