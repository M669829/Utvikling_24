const sqlite3 =require('better-sqlite3');
const db = sqlite3('Blackjack', { verbose: console.log });
const {hash, sammenlign} = require("./krypter")

function opprettbruker(navn,passord,epost){
    
    const Hashedpassord = hash(passord)

    const stmt = db.prepare('INSERT INTO Spillere (Navn, Saldo, Passord, Epost) VALUES (?, ?, ?,?)');
    stmt.run(navn, 1000, Hashedpassord,epost);  // Adminrolle er 0 for vanlige brukere, 1 for admin
}

function getbruker(epost){
    const spr = db.prepare('Select * From Spillere WHERE Epost = ?')
    return spr.get(epost);
}

function oppdaterbruker(id,saldo) {
    db.prepare('UPDATE Spillere SET Saldo = ? WHERE id = ?').run(saldo,id)
    return db.prepare('Select * From Spillere WHERE id = ?').get(id)
} 

/*let bruker = getbruker("test@gmail.com")
console.log(bruker)
console.log(sammenlign("1234",bruker.Passord))
bruker = oppdaterbruker(bruker.id,600)
console.log(bruker.Saldo)*/

module.exports = {
    getbruker, oppdaterbruker, opprettbruker
}