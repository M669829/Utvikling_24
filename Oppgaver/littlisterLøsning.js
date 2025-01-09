const Tall_1 = [3, 8, 12, 5, 7, 20];
const Tall_2 = [15, 22, 9, 3, 14, 6];
const Ord_1 = ["eple", "bananer", "druer", "gulrot", "tomat", "sylteagurk"];
const Ord_2  = ["bord", "stol", "sofa", "skap", "lampe", "benk"];

function Summer(numbers) {
    // Summer alle nummerene i en tabell
   let sum = 0;
   for (let i = 0; i < numbers.length; i++) {
      sum += numbers[i];
   }
 return sum;
}

console.log(Summer(Tall_1)); // Forventet svar: 55

function finnstørste(liste) {
   //Finn største tall i gitt liste 
   let størst = 0;
   for  (let i = 0; i < liste.length; i++) {
      if (liste[i]>størst) {
         størst = liste[i];
      }
   }
   return størst;
}

console.log(finnstørste(Tall_1)); // Forventet Svar: 20 

function filterpartall(liste) {
  // Filtrer ut oddetall fra liste
  let nyliste = [];
  for  (let i = 0; i < liste.length; i++) {
   if (liste[i] % 2 === 0) {
      nyliste.push(liste[i]);
   }
  }
  return nyliste;
}
console.log(filterpartall(Tall_2)); // Forventet svar: [22, 14, 6]


function filtrerutord(liste,lengde) {
  //Filtrer ut basert på gitt lengde
  let nyliste = [];
  for  (let i = 0; i < liste.length; i++) {
   if (liste[i].length > lengde) {
      nyliste.push(liste[i]);
   }
  }
  return nyliste;
}
console.log(filtrerutord(Ord_1,5)); // Forventet svar: ["bananer","gulrot", "sylteagurk"]


function antallforekomster (liste, element) {
    // Hvor mange ganger forekommer et element i en gitt liste
   let antall = 0;
   for  (let i = 0; i < liste.length; i++) {
      if (element === liste[i]) {
         antall++;
      }
     }
   return antall
}

console.log(antallforekomster(Ord_1, "tomat")); // Forventet svar: 1
console.log(antallforekomster(Ord_1, "pære")); // Forventet svar: 0


function sammenslåLister(liste1, liste2) {
   // Slå sammen to lister
   let nyliste = [];

   for (let i = 0; i< liste1.length; i++){
      nyliste.push(liste1[i]);
   }
   
   for (let i = 0; i< liste2.length; i++){
      nyliste.push(liste2[i]);
   }
   
   return nyliste;
}

console.log(sammenslåLister(Tall_1, Ord_1));
// Forventet svar: [3, 8, 12, 5, 7, 20, "eple", "bananer", "druer", "gulrot", "tomat", "sylteagurk"]


function ordmedbokstav(liste, bokstav) {
   //returner alle ord i en liste som inneholder gitt bokstav
   let nyliste = [];

   for (let i = 0; i<liste.length; i++) {
      if (liste[i].indexOf(bokstav) !== -1) {
         nyliste.push(liste[i]);
      }
   }
   return nyliste;
}

console.log(ordmedbokstav(Ord_2, "o")); // Forventet svar: ["bord", "stol", "sofa"]

function inneholderStørstetall(liste1, liste2) {
    //Sammenlign liste1 med liste2 og sjekk om liste1 inneholder et større tall en liste2

     let svar = false;
     if (finnstørste(liste1) > finnstørste(liste2)) {
      svar = true;
     } 
     return svar;
}

console.log(inneholderStørstetall(Tall_1, Tall_2)); // Forventet svar: false (22 > 20)