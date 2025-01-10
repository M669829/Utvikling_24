// Blackjack funksjoner


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
// Eksempel;
 console.log(genererKortstokk()); 
// Forventet svar: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", ...], eventuelt mer avansert med hjerte,kløver,spar og ruter
 
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

// Eksempel:
console.log(blandKortstokk(genererKortstokk()) ); 
// Forventet svar: En tilfeldig blandet kortstokk



function trekkKort(kortstokk) {
    // Trekk et kort fra kortstokken
    let kort = kortstokk.pop();
    return kort;
}

// Eksempel:
console.log(trekkKort(kortstokk));
// Forventet svar: Et kort fra kortstokken (for eksempel "2"), og kortstokken inneholder ett mindre kort etter trekket.

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

// Eksempler:
console.log(beregnVerdi(["A", "10"])); // Forventet svar: 21
console.log(beregnVerdi(["A", "9", "A"])); // Forventet svar: 21
console.log(beregnVerdi(["5", "6", "7"])); // Forventet svar: 18

function erBust(hand) {
    // Sjekk om hånden har verdi over 21
    let verdi = false;
    if (beregnVerdi(hand)>21) {
        verdi = true;
    }
    return verdi;
}

// Eksempler:
console.log(erBust(["10", "7", "6"])); // Forventet svar: true (23 er over 21)
console.log(erBust(["5", "7", "8"])); // Forventet svar: false (20 er innenfor grensen)

function erBlackjack(hand) {
    // Sjekk om hånden er en blackjack (21 med to kort)
    let verdi = false;
    if (beregnVerdi(hand) === 21 && hand.length === 2) {
        verdi = true;
    }
    return verdi;
}

// Eksempler:
console.log(erBlackjack(["A", "10"])); // Forventet svar: true (ess og 10 = blackjack)
console.log(erBlackjack(["A", "9", "A"])); // Forventet svar: false (mer enn to kort)

function spillerTrekk(kortstokk, spillerHand) {
    // Trekk et kort for spilleren og legg det til spillerens hånd
    let kort = kortstokk.pop();
    spillerHand.push(kort);
}

// Eksempel:
let spillerHand = ["5", "9"];
spillerTrekk(kortstokk, spillerHand);
console.log(spillerHand);
// Forventet svar: ["5", "9", ...] med ett ekstra kort lagt til fra kortstokken.

function dealerTrekk(kortstokk, dealerHand) {
    // Dealer trekker kort til verdien er minst 17
    while (beregnVerdi(dealerHand) < 17) {
        let kort = kortstokk.pop();
        dealerHand.push(kort);
    }
    return dealerHand;
}

// Eksempel:
let dealerHand = ["2","3"];
dealerTrekk(kortstokk, dealerHand);
console.log(dealerHand);
// Forventet svar: En hånd med minst 17 i verdi, for eksempel ["K", "6", "2"].

function bestemVinner(spillerHand, dealerHand) {
    // Bestem vinneren mellom spiller og dealer
    const spillerVerdi = beregnVerdi(spillerHand);
    const dealerVerdi = beregnVerdi(dealerHand);

    if (spillerVerdi>dealerVerdi) {
        return "Spiller vinner " + dealerVerdi + " < "  + spillerVerdi; 
    } else if (spillerVerdi>dealerVerdi) {
        return "Uavgjort: Pengene sendes tilbake" + dealerVerdi + " = "  + spillerVerdi
    }
    else {
        return "Dealer vinner " + dealerVerdi + " > "  + spillerVerdi
    }
}

// Eksempler:
console.log(bestemVinner(["A", "10"], ["10", "9"])); // Forventet svar: "Spiller vinner" (21 > 19)
console.log(bestemVinner(["5", "6", "7"], ["9", "8"])); // Forventet svar: "Dealer vinner" (17 < 18)
console.log(bestemVinner(["10", "7"], ["10", "7"])); // Forventet svar: "Uavgjort" (17 = 17)