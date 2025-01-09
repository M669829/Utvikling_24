const Tall_1 = [3, 8, 12, 5, 7, 20];
const Tall_2 = [15, 22, 9, 3, 14, 6];
const Ord_1 = ["eple", "bananer", "druer", "gulrot", "tomat", "sylteagurk"];
const Ord_2  = ["bord", "stol", "sofa", "skap", "lampe", "benk"];

function Summer(numbers) {
   // Summer alle nummerene i en tabell
}

console.log(sumOfNumbers(Tall_1)); // Forventet svar: 55

function finnstørste(liste) {
//Finn største tall i gitt liste 
}

console.log(finnstørste(Tall_1)); // Forventet Svar: 20 

function filterpartall(liste) {
  // Filtrer ut oddetall fra liste
}
console.log(filterpartall(Tall_2)); // Forventet svar: [22, 14, 6]


function filtrerutord(liste,lengde) {
  //Filtrer ut basert på gitt lengde
}
console.log(filtrerutord(Ord_1,5)); // Forventet svar: ["bananer", "sylteagurk"]


function antallforekomster (liste, element) {
    // Hvor mange ganger forekommer et element i en gitt liste
}

console.log(antallforekomster(Ord_1, "tomat")); // Forventet svar: 1
console.log(antallforekomster(Ord_1, "pære")); // Forventet svar: 0


function sammenslåLister(liste1, liste2) {
   // Slå sammen to lister
}
console.log(sammenslåLister(Tall_1, Ord_1));
// Forventet svar: [3, 8, 12, 5, 7, 20, "eple", "bananer", "druer", "gulrot", "tomat", "sylteagurk"]


function ordmedbokstav(liste, bokstav) {
   //returner alle ord i en liste som inneholder gitt bokstav
}

console.log(ordmedbokstav(Ord_2, "o")); // Forventet svar: ["bord", "stol", "sofa", "lampe"]

function inneholderStørstetall(liste1, liste2) {
    //Sammenlign liste1 med liste2 og sjekk om liste1 inneholder et større tall en liste2
}
 

console.log(inneholderStørstetall(Tall_1, Tall_2)); // Forventet svar: false (22 > 20)
//test 