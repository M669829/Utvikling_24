const playerHandDiv = document.getElementById("player-hand");
const dealerHandDiv = document.getElementById("dealer-hand");
const outputDiv = document.getElementById("output");
const playerValueDiv = document.getElementById("player-value");
const dealerValueDiv = document.getElementById("dealer-value");


document.getElementById("start").addEventListener("click", async () => {
    const response = await fetch("/start", { method: "POST" });
    const data = await response.json();

    if (!response.ok) {
        alert(data.melding); // Vis feilmelding hvis innsats ikke er satt
        return;
    }

    document.getElementById("startBilde").style.display = "none";

    updateHand(playerHandDiv, data.spillerHand);
    updateHand(dealerHandDiv, [data.dealerSynlig, "bak bak"]);
    outputDiv.textContent = data.melding;
    outputDiv.style.visibility = "visible"; // Make it visible

    // Oppdater verdiene
    playerValueDiv.textContent = `Spillerens verdi: ${data.Spillerverdi}`;
    dealerValueDiv.textContent = `Dealerens synlige verdi: ${data.Dealerverdi}`;
    oppdaterSaldoUI(data.saldo, data.innsats)

    // Aktiver knappene for trekk og stå
    if (data.melding.includes("Blackjack!")) {
        document.getElementById("trekke").disabled = true;
        document.getElementById("staa").disabled = true;
        
    } else {
    document.getElementById("trekke").disabled = false;
    document.getElementById("staa").disabled = false;
    document.getElementById("start").disabled = true;
    }
});

document.getElementById("trekke").addEventListener("click", async () => {
    const response = await fetch("/trekke", { method: "POST" });
    const data = await response.json();

    updateHand(playerHandDiv, data.spillerHand);
    playerValueDiv.textContent = `Spillerens verdi: ${data.Spillerverdi}`;
    outputDiv.textContent = data.melding;


    if (data.melding.includes("bust")) {
        document.getElementById("trekke").disabled = true;
        document.getElementById("staa").disabled = true;
        document.getElementById("start").disabled = false;
        document.getElementById("saldo").innerText = `Saldo: ${data.saldo}`;
    }
    
    
});

document.getElementById("staa").addEventListener("click", async () => {
    const response = await fetch("/staa", { method: "POST" });
    const data = await response.json();

    updateHand(playerHandDiv, data.spillerHand);
    updateHand(dealerHandDiv, data.dealerHand);
    playerValueDiv.textContent = `Spillerens verdi: ${data.Spillerverdi}`;
    dealerValueDiv.textContent = `Dealerens synlige verdi: ${data.Dealerverdi}`;
    outputDiv.textContent = data.melding;
    document.getElementById("saldo").innerText = `Saldo: ${data.saldo}`;


    // Deaktiver knappene etter spillslutt
    document.getElementById("trekke").disabled = true;
    document.getElementById("staa").disabled = true;
    document.getElementById("start").disabled = false;
});


async function settInnsats() {
    const innsats = parseInt(document.getElementById("innsatsInput").value, 10);
    if (isNaN(innsats) || innsats <= 0) {
        alert("Innsatsen må være et positivt tall!");
        return;
    }

    const response = await fetch("/settInnsats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ innsats })
    });

    const data = await response.json();
    if (response.ok) {
        oppdaterSaldoUI(data.saldo, data.innsats);
        alert(data.melding);
    } else {
        alert(data.melding);
    }
}

function updateHand(handDiv, cards) {
    handDiv.innerHTML = ""; // Tøm eksisterende kort
    cards.forEach((card) => {
        const cardElement = document.createElement("img"); // Opprett bilde-element
        const cardName = card.replace(" ", "_"); // Bytt ut mellomrom med "_"
        cardElement.src = `cards/${cardName}.png`; // Sett filstien til bildet
        cardElement.alt = card; // Legg til alternativ tekst
        cardElement.className = "card"; // Legg til CSS-klasse for styling
        handDiv.appendChild(cardElement);
    });
}

function oppdaterSaldoUI(saldo, innsats) {
    document.getElementById("saldo").innerText = `Saldo: ${saldo}`;
    document.getElementById("innsats").innerText = `Innsats: ${innsats}`;
}