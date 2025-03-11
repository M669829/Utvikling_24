const bcrypt = require('bcrypt');

const saltRounds = 10; // Antall runder med hashing

function hash(passord) {
return  bcrypt.hashSync(passord, saltRounds); 
}

function sammenlign(passord,Hashedpassord) {
    return bcrypt.compareSync(passord, Hashedpassord); 
}

module.exports = {
    hash,
    sammenlign 
}