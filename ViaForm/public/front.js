let contentDiv = document.getElementById("content");

// Asynkron funksjon for å hente data fra serveren
async function updateData() {
    let response = await fetch("/getData"); // Henter data fra /getData
    let data = await response.json(); // Konverterer responsen til JSON

    let innerHTML = "";
    for (let row of data) {
        innerHTML += "<p>" + row.message + "</p>"; // Viser hver melding
    }
    contentDiv.innerHTML = innerHTML; // Oppdaterer innholdet på siden
    setTimeout(updateData, 1000); // Oppdaterer dataen hvert sekund
}

updateData(); // Kaller funksjonen når siden lastes

async function hentKunder() {
    const response = await fetch('/get-kunder');  // Henter kundene fra serveren
    const kunder = await response.json();  // Konverterer responsen til JSON

    const kundeliste = document.getElementById('kundeliste');
    kundeliste.innerHTML = '';  // Tømmer listen før vi legger til nye kunder

    kunder.forEach(kunde => {
        const li = document.createElement('li');
        li.textContent = `Navn: ${kunde.Navn}, E-post: ${kunde.Epost}, Alder: ${kunde.Alder}`;
        kundeliste.appendChild(li);  // Legger til hver kunde i listen
    });
}

// Kaller funksjonen for å hente kundene når siden lastes
window.onload = hentKunder;