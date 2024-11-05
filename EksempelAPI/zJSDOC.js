/**
 * Legger til en karakter i karakteroversikten
 * @param {number} grade En tallkarakter. Skal være heltall mellom 1 og 6. IV ikke støttet
 */
function addGrade(grade) {
    grades.push(grade);
}

/**
 * 
 */
 * Henter siste karakter som er lagret
 * @returns {number} Returnerer siste karakter som er lagret
 */
function getLast() {
    return (grades[grades.length - 1]);
}



/**
 * Eksempel funksjon
 * Legger sammen to tall.
 * @param {number} a - Det første tallet.
 * @param {number} b - Det andre tallet.
 * @return {number} Summen av a og b.
 */
function add(a, b) {
    return a + b;
}



/**
 * Eksempel definere type
 * @type {string}
 */
let navn = "John";


/**
 * Støtte for klasser og objekter, kan brukes til å dokumentere klasser og konstruktører
 * Representerer en person.
 * @class
 */
class Person {
    /**
     * Lager en ny person.
     * @param {string} navn - Navnet til personen.
     */
    constructor(navn) {
        this.navn = navn;
    }
}


/**
 * Henter data fra en URL.
 * @async
 * @param {string} url - URL-en til ressursen.
 * @return {Promise<Object>} Returnerer en Promise som løser til objektet med data.
 */
async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

/**
 * JSDoc gir muligheten til å dokumentere moduler og eksportere/importere funksjoner eller objekter.
 * @module MathUtils
 */
export function add(a, b) {
    return a + b;
}


