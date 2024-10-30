const bcrypt = require('bcrypt') // Bruker bcrypt

const saltrunder = 10;          //antall saltrunder, hvor flere hvor bedre men kan ta lengre tid å genere
const passord1 = 'tester123'
const passord2 = 'tester123'

function metode1(passord, saltrunder ) { // metode1 for å lage salter, 

    const salt = bcrypt.genSaltSync(saltrunder); // generere saltet selv, får mer "kontroll" over det, input = antall runder saltet manipuleres 
    console.log("Salt: " + salt);
    const hash = bcrypt.hashSync(passord, salt); // Generere hashen, Input = passordet + saltet du har generer
    console.log("Hash: " + hash);

    return hash; 

}

function metode2(passord, saltrunder) { // hurtigere metode for å generere en hash
    const hash = bcrypt.hashSync(passord, saltrunder); //generere hashen, saltet genereres automatisk, input = passord + antall runder saltet maipuleres 
    console.log("Hash: " + hash)
}

const lagrethash = metode1(passord1,saltrunder); //lagrer saltet slik at det kan bruke, 
metode2(passord2,saltrunder); 

const resultat = bcrypt.compareSync(passord2,  lagrethash); //metode for å sjekke om passordet stemmer overens med hashen, returnerer boolsk veri

console.log(resultat);


