// public/js/script.js

async function loadCart() {
    const res = await fetch('/cart');
    const data = await res.json();
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = data.cart.length > 0 
        ? data.cart.map(item => `<li>${item}</li>`).join('') 
        : '<li>Handlekurven er tom</li>';
}

document.getElementById('cart-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const item = document.getElementById('item').value;
    await fetch('/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `item=${item}`
    });
    loadCart(); // Oppdater handlekurven
});

loadCart();
