// cart.js - Complete Error-Free Version
document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // 1. Initialize Variables
    // ======================
    const cartBody = document.getElementById('cart-body');
    const subtotalEl = document.getElementById('subtotal');
    const grandTotalEl = document.getElementById('grand-total');
    const deliveryEl = document.getElementById('delivery');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deliveryFee = 50;

    // =================
    // 2. Core Functions
    // =================

    // Update cart display
    function renderCart() {
        if (!cartBody) return; // Skip if not on cart page
        
        cartBody.innerHTML = '';
        
        if (cart.length === 0) {
            showEmptyCart();
            return;
        }

        let subtotal = 0;
        
        cart.forEach((item, index) => {
            // Validate item structure
            if (!item.id || !item.price || !item.quantity) {
                console.error('Invalid cart item:', item);
                return;
            }

            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const row = document.createElement('tr');
            row.className = 'cart-item';
            row.dataset.id = item.id;
            row.innerHTML = `
                <td>
                    <img src="${item.image || ''}" alt="${item.title || 'Product'}">
                    <span>${item.title || 'Untitled Item'}</span>
                </td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>
                    <div class="quantity-control">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                </td>
                <td>₹${itemTotal.toFixed(2)}</td>
                <td><i class="fas fa-trash remove-btn" data-index="${index}"></i></td>
            `;
            cartBody.appendChild(row);
        });

        updateTotals(subtotal);
    }

    // Show empty cart message
    function showEmptyCart() {
        cartBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="btn btn-primary">Browse Meals</a>
                </td>
            </tr>
        `;
        subtotalEl.textContent = '₹0';
        deliveryEl.textContent = `₹${deliveryFee}`;
        grandTotalEl.textContent = `₹${deliveryFee}`;
    }

    // Calculate and display totals
    function updateTotals(subtotal) {
        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        deliveryEl.textContent = `₹${deliveryFee}`;
        grandTotalEl.textContent = `₹${(subtotal + deliveryFee).toFixed(2)}`;
    }

    // ======================
    // 3. Cart Modifications
    // ======================

    // Add item to cart (called from product pages)
    window.addToCart = function(item) {
        // Validate item
        if (!item.id || !item.price) {
            console.error('Invalid item format:', item);
            return false;
        }

        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cart.push({
                id: item.id,
                title: item.title || 'Untitled Item',
                price: parseFloat(item.price),
                image: item.image || '',
                quantity: item.quantity || 1
            });
        }
        
        saveCart();
        showNotification('Item added to cart!', 'success');
        return true;
    };

    // Update item quantity
    function updateQuantity(index, change) {
        if (index < 0 || index >= cart.length) {
            console.error('Invalid index:', index);
            return;
        }

        cart[index].quantity += change;
        cart[index].quantity = Math.max(1, cart[index].quantity); // Never go below 1
        saveCart();
    }

    // Remove item from cart
    function removeItem(index) {
        if (index < 0 || index >= cart.length) {
            console.error('Invalid index:', index);
            return;
        }

        cart.splice(index, 1);
        saveCart();
        showNotification('Item removed', 'success');
    }

    // Clear entire cart
    function clearCart() {
        if (cart.length === 0 || !confirm('Are you sure you want to clear your cart?')) {
            return;
        }

        cart = [];
        saveCart();
        showNotification('Cart cleared', 'success');
    }

    // ======================
    // 4. Utility Functions
    // ======================

    // Save cart to localStorage
    function saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            if (cartBody) renderCart(); // Only re-render if on cart page
        } catch (e) {
            console.error('Failed to save cart:', e);
        }
    }

    // Update cart counter in header
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    // Show notification message
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // ======================
    // 5. Event Listeners
    // ======================

    function setupEventListeners() {
        // Checkout button
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Your cart is empty', 'error');
                    return;
                }
                alert('Proceeding to checkout!');
                // window.location.href = 'checkout.html';
            });
        }

        // Clear cart button
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }

        // Continue shopping button
        const continueBtn = document.getElementById('continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Delegate events for dynamic elements
        document.addEventListener('click', function(e) {
            // Quantity buttons
            if (e.target.classList.contains('qty-btn')) {
                const index = e.target.dataset.index;
                if (e.target.classList.contains('plus')) {
                    updateQuantity(index, 1);
                } else if (e.target.classList.contains('minus')) {
                    updateQuantity(index, -1);
                }
            }
            
            // Remove button
            if (e.target.classList.contains('remove-btn')) {
                removeItem(e.target.dataset.index);
            }
        });
    }

    // ======================
    // 6. Initialization
    // ======================
    updateCartCount();
    renderCart();
    setupEventListeners();
});