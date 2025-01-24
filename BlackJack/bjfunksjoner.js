// Blackjack funksjoner

const prompt = require("prompt-sync")({ sigint: true });

let kortstokk = genererKortstokk();
kortstokk = blandKortstokk(kortstokk);

function genererKortstokk() {
    let kort = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
    let type = ['Hjerte', 'Kløver', 'Spar', 'Ruter']
    let kortstokk = [];
    for (let i = 0; i<type.length; i++) {
        for(let j = 0; j<kort.length; j++) {
            kortstokk.push(`${kort[j]} ${type[i]}`);
        }
    }
    return kortstokk;
 }
 
function blandKortstokk(kortstokk) {
    //Stokk om en kortstokk i random rekkefølge

    for (let i = kortstokk.length-1; i>0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        
        let temp = kortstokk[i];
        kortstokk[i] = kortstokk[random];
        kortstokk[random] = temp;

    }
    return kortstokk
} 



function trekkKort(kortstokk) {
    // Trekk et kort fra kortstokken
    let kort = kortstokk.pop();
    return kort;
}

function beregnVerdi(hand) {
    // blackjack
    let sum = 0;
    let antallAss = 0;

    for(let i = 0; i<hand.length; i++) {
        let kort = hand[i].split(" ")[0];
        
        if (kort === 'A') {
            sum += 11;
            antallAss++;
        }
        else if (kort === 'J'|| kort === 'Q'|| kort === 'K') {
            sum += 10;
        } else {
            sum += parseInt(kort);
        }
    }
    
    while (sum>21 && antallAss>0) {
        sum -= 10;
        antallAss--;
    }
    return sum;
}


function erBust(hand) {
    // Sjekk om hånden har verdi over 21
    let verdi = false;
    if (beregnVerdi(hand)>21) {
        verdi = true;
    }
    return verdi;
}


function erBlackjack(hand) {
    // Sjekk om hånden er en blackjack (21 med to kort)
    let verdi = false;
    if (beregnVerdi(hand) === 21 && hand.length === 2) {
        verdi = true;
    }
    return verdi;
}



function spillerTrekk(kortstokk, spillerHand) {
    // Trekk et kort for spilleren og legg det til spillerens hånd
    let kort = kortstokk.pop();
    spillerHand.push(kort);
}

// Eksempel:

function dealerTrekk(kortstokk, dealerHand) {
    // Dealer trekker kort til verdien er minst 17
    while (beregnVerdi(dealerHand) < 17) {
        let kort = kortstokk.pop();
        dealerHand.push(kort);
    }
    return dealerHand;
}

// Eksempel:

// Forventet svar: En hånd med minst 17 i verdi, for eksempel ["K", "6", "2"].

function bestemVinner(spillerHand, dealerHand, innsats) {
    // Bestem vinneren mellom spiller og dealer
    const spillerVerdi = beregnVerdi(spillerHand);
    const dealerVerdi = beregnVerdi(dealerHand);

    if (spillerVerdi>dealerVerdi) {
        innsats = innsats * 2;
        return {medling :"Spiller vinner " + dealerVerdi + " < "  + spillerVerdi + ", du vant = "+ innsats+ "kr", innsats: innsats  } 
    } else if (spillerVerdi===dealerVerdi) {
        innsats = 0;
        return {medling : "Uavgjort: Pengene sendes tilbake" + dealerVerdi + " = "  + spillerVerdi, innsats: innsats  }
    }
    else if (dealerVerdi>spillerVerdi && !erBust(dealerHand)) { 
        let temp = innsats;
        innsats = 0;
        return  {medling : "Dealer vinner " + dealerVerdi + " > "  + spillerVerdi + "Du tapte " + temp+ "kr", innsats: innsats  }
    } else {
        innsats = innsats * 2;
        return {medling : "Dealer er bust, du vant = "+ innsats+ "kr", innsats: innsats}
    }
}





// Blackjack-spillet
function blackjack() {
    console.log("Velkommen til Blackjack!");

    let kortstokk = blandKortstokk(genererKortstokk());

    while (true) {

        if (kortstokk.length < 52/2) {
            console.log("For få kort i kortstokken, genererer en ny kortstokk.");
            kortstokk = blandKortstokk(genererKortstokk());
        }

        let spillerHand = [trekkKort(kortstokk), trekkKort(kortstokk)];
        let dealerHand = [trekkKort(kortstokk), trekkKort(kortstokk)];

        console.log(`Din hånd: ${spillerHand.join(", ")} (Verdi: ${beregnVerdi(spillerHand)})`);
        console.log(`Dealerens synlige kort: ${dealerHand[0]}`);

        // Spilleren sin tur
        while (true) {
            const valg = prompt("Vil du 'trekke' eller 'staa'? ").toLowerCase();

            if (valg === "trekke") {
                spillerHand.push(trekkKort(kortstokk));
                console.log(`Du trakk: ${spillerHand[spillerHand.length - 1]}`);
                console.log(`Din hånd: ${spillerHand.join(", ")} (Verdi: ${beregnVerdi(spillerHand)})`);

                if (erBust(spillerHand)) {
                    console.log("Du er bust! Dealer vinner.");
                    break;
                }
            } else if (valg === "staa") {
                break;
            } else {
                console.log("Ugyldig valg. Skriv 'trekke' eller 'stå'.");
            }
        }
        

        // Dealerens tur
        dealerTrekk(kortstokk, dealerHand);
        console.log(`Dealerens hånd: ${dealerHand.join(", ")} (Verdi: ${beregnVerdi(dealerHand)})`);
        // Bestem vinner
        console.log(bestemVinner(spillerHand, dealerHand));

        // Spør spilleren om de vil fortsette eller avslutte
        const slutte = prompt("\nVil du spille en ny runde eller avslutte? Skriv 'ny' for nytt spill eller 'exit' for å avslutte: ").toLowerCase();
        if (slutte === "exit") {
            console.log("Takk for at du spilte Blackjack! Ha en fin dag!");
            break;
        } else if (slutte !== "ny") {
            console.log("Ugyldig valg. Spillet avsluttes.");
            break;
        }
        

    }

}

module.exports = {
    genererKortstokk,
    blandKortstokk,
    trekkKort,
    beregnVerdi,
    erBust,
    dealerTrekk,
    bestemVinner,
    erBlackjack,
};

