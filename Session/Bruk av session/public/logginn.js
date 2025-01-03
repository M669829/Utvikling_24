const logginnForm = document.querySelector('#logginn-form');

logginnForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // FOrhindre standard form innsending 
    
    const brukernavn = document.getElementById('username').value;
    const passord = document.getElementById('password').value;
    

    try { 
        const response = await fetch('/logginn', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: brukernavn, password: passord})

    });

    const result = await response.json();

    if (result.success){
        window.location.href = result.redirect;
    }
    else {
        document.getElementById('password').value = "";
        showMessage(result.message);
    }
}catch (error) {
        console.error('Innlogging feilet:', error);
        showMessage('Noe gikk galt. Vennligst prøv igjen senere.');
    }
    

});



function showMessage(message) {
    const feilmelding = document.getElementById('error-message');
    feilmelding.textContent = message;
    
}
