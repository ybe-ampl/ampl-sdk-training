// Données des produits
const products = [
    {
        id: 1,
        name: "Chronograph Royal",
        price: 2450,
        description: "Montre suisse haut de gamme en or 18 carats avec mouvement automatique et bracelet en cuir véritable.",
        image: "Montre de Luxe",
        category: "Horlogerie"
    },
    {
        id: 2,
        name: "Sac Élégance",
        price: 1890,
        description: "Sac en cuir italien fait main avec finitions dorées et doublure en soie.",
        image: "Sac de Luxe",
        category: "Maroquinerie"
    },
    {
        id: 3,
        name: "Essence Royale",
        price: 385,
        description: "Parfum exclusif aux notes rares d'oud et de rose bulgare.",
        image: "Parfum de Luxe",
        category: "Parfumerie"
    },
    {
        id: 4,
        name: "Collier Diamant",
        price: 5500,
        description: "Collier en or blanc 18 carats serti de diamants certifiés.",
        image: "Collier de Luxe",
        category: "Bijouterie"
    },
    {
        id: 5,
        name: "Stylo Prestige",
        price: 750,
        description: "Stylo plume en édition limitée avec plume en or et laque noire.",
        image: "Stylo de Luxe",
        category: "Écriture"
    }
];

// Panier
let cart = [];
let currentDiscount = 0;

// Codes promo
const promoCodes = {
    'LUXE10': 10,
    'VIP20': 20,
    'ROYAL15': 15
};

// Affichage des pages
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'catalogue') {
        loadCatalogue();
    } else if (pageId === 'cart') {
        loadCart();
    } else if (pageId === 'payment') {
        loadPayment();
    }
}

// Charger le catalogue
function loadCatalogue() {
    const grid = document.getElementById('catalogue-grid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">€${product.price.toLocaleString()}</div>
                <p class="product-description">${product.description}</p>
                <button class="btn" onclick="viewProduct(${product.id})">Voir le produit</button>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

// Voir un produit
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // ZONE 6: TRACKING - VUE PRODUIT
    /*
    gtag('event', 'view_item', {
        currency: 'EUR',
        value: product.price,
        items: [{
            item_id: product.id,
            item_name: product.name,
            category: product.category,
            price: product.price
        }]
    });
    */
    // FIN ZONE 6
    
    const productDetails = document.getElementById('product-details');
    productDetails.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
            <div>
                <div class="product-image" style="height: 400px; font-size: 1.5rem;">${product.image}</div>
            </div>
            <div>
                <h1>${product.name}</h1>
                <div class="product-price" style="font-size: 2rem; margin: 1rem 0;">${product.price.toLocaleString()}</div>
                <p style="margin-bottom: 1rem; color: #666;">${product.description}</p>
                <p style="margin-bottom: 2rem;"><strong>Catégorie:</strong> ${product.category}</p>
                <button class="btn" onclick="addToCart(${product.id})">Ajouter au panier</button>
                <button class="btn" onclick="showPage('catalogue')" style="margin-left: 1rem; background: #666;">Retour au catalogue</button>
            </div>
        </div>
    `;
    
    showPage('product');
}

// Ajouter au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartCount();
    
    // ZONE 2: TRACKING - AJOUT AU PANIER
    // Exemple: trackAddToCart(product);
    /*
    gtag('event', 'add_to_cart', {
        currency: 'EUR',
        value: product.price,
        items: [{
            item_id: product.id,
            item_name: product.name,
            category: product.category,
            price: product.price,
            quantity: 1
        }]
    });
    */
    // FIN ZONE 2
    
    alert(`${product.name} ajouté au panier !`);
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Charger le panier
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide</p>';
        cartTotal.textContent = 'Total: €0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>€${item.price.toLocaleString()} x ${item.quantity}</p>
            </div>
            <div>
                <button onclick="removeFromCart(${item.id})">Supprimer</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = `Total: €${total.toLocaleString()}`;
}

// Supprimer du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    loadCart();
}

// Charger la page de paiement
function loadPayment() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = total * currentDiscount / 100;
    const finalTotal = total - discountAmount;
    
    document.getElementById('payment-total').textContent = `Total: €${finalTotal.toLocaleString()}`;
}

// Appliquer un code promo
function applyPromo() {
    const promoCode = document.getElementById('promo-code').value.toUpperCase();
    const promoMessage = document.getElementById('promo-message');
    
    if (promoCodes[promoCode]) {
        currentDiscount = promoCodes[promoCode];
        promoMessage.innerHTML = `<div class="message success">Code promo appliqué ! Réduction de ${currentDiscount}%</div>`;
        loadPayment();
    } else {
        promoMessage.innerHTML = `<div class="message error">Code promo invalide</div>`;
    }
}

// Traitement du paiement
document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ZONE 3: TRACKING - DÉBUT DE PAIEMENT
        /*
        gtag('event', 'begin_checkout', {
            currency: 'EUR',
            value: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            items: cart.map(item => ({
                item_id: item.id,
                item_name: item.name,
                category: item.category,
                price: item.price,
                quantity: item.quantity
            }))
        });
        */
        // FIN ZONE 3
        
        // Simulation du paiement (50% de chance de succès)
        const paymentSuccess = Math.random() > 0.5;
        const orderStatus = document.getElementById('order-status');
        const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (paymentSuccess) {
            const orderId = Date.now();
            
            // ZONE 4: TRACKING - ACHAT RÉUSSI
            /*
            gtag('event', 'purchase', {
                transaction_id: orderId,
                currency: 'EUR',
                value: orderTotal,
                items: cart.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    category: item.category,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
            
            // Facebook Pixel
            fbq('track', 'Purchase', {
                value: orderTotal,
                currency: 'EUR'
            });
            */
            // FIN ZONE 4
            
            orderStatus.innerHTML = `
                <div class="message success">
                    <h3>✓ Paiement réussi</h3>
                    <p>Numéro de commande: #${orderId}</p>
                    <p>Montant: €${orderTotal.toLocaleString()}</p>
                </div>
            `;
            cart = [];
            updateCartCount();
        } else {
            // ZONE 5: TRACKING - PAIEMENT ÉCHOUÉ
            /*
            gtag('event', 'payment_failed', {
                currency: 'EUR',
                value: orderTotal
            });
            */
            // FIN ZONE 5
            
            orderStatus.innerHTML = `
                <div class="message error">
                    <h3>✗ Paiement échoué</h3>
                    <p>Veuillez vérifier vos informations de paiement et réessayer.</p>
                </div>
            `;
        }
        
        showPage('thanks');
    });
});

// Initialisation
updateCartCount();