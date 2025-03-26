document.addEventListener('DOMContentLoaded', function() {
    // ========== Theme Toggle ==========
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.onclick = () => {
            document.body.classList.toggle('dark-theme');
            themeBtn.classList.toggle('fa-sun');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        };

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeBtn.classList.add('fa-sun');
        }
    }

    // ========== Search Toggle ==========
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.querySelector('.search-form');
    
    if (searchBtn && searchForm) {
        searchBtn.onclick = () => {
            searchForm.classList.toggle('active');
            document.getElementById('searchBox').focus();
        };

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-form') && !e.target.closest('#search-btn')) {
                searchForm.classList.remove('active');
            }
        });
    }

    // ========== Mobile Menu ==========
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.querySelector('.navbar');
    
    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
            menuBtn.classList.toggle('fa-times');
            document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                menuBtn.classList.remove('fa-times');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && !e.target.closest('#menu-btn')) {
                navbar.classList.remove('active');
                menuBtn.classList.remove('fa-times');
                document.body.style.overflow = '';
            }
        });
    }

    // ========== Menu Filtering ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if (filterBtns.length && menuItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.dataset.category;
                menuItems.forEach(item => {
                    item.style.display = category === 'all' || item.dataset.category.includes(category) 
                        ? 'flex' 
                        : 'none';
                });
            });
        });
    }

    // ========== Shopping Cart ==========
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalEl = document.querySelector('.subtotal');
    const totalEl = document.querySelector('.total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartNotification = document.querySelector('.cart-notification');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deliveryFee = 40;

    // Cart Functions
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cart.forEach(item => {
                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.innerHTML = `
                    <div class="cart-item-container">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <div class="cart-item-meta">
                                <span class="cart-item-price">₹${item.price}</span>
                                <div class="cart-item-controls">
                                    <button class="qty-btn minus">−</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="qty-btn plus">+</button>
                                </div>
                            </div>
                            <button class="remove-item btn-remove" data-id="${item.id}">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                        <div class="item-total">₹${item.price * item.quantity}</div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemEl);
            });
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
        if (totalEl) totalEl.textContent = `₹${subtotal + deliveryFee}`;
        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Cart Event Listeners
    if (cartBtn && cartModal) {
        cartBtn.onclick = () => {
            updateCartUI();
            cartModal.classList.add('active');
        };

        closeCart.onclick = () => {
            cartModal.classList.remove('active');
        };

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cart-content') && !e.target.closest('#cart-btn')) {
                cartModal.classList.remove('active');
            }
        });
    }

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = menuItem.dataset.id;
            const itemTitle = menuItem.querySelector('.item-title').textContent.trim();
            const itemPrice = parseFloat(menuItem.querySelector('.current-price').textContent.replace('₹', ''));
            const itemImage = menuItem.querySelector('.item-image img').src;
            const quantity = parseInt(menuItem.querySelector('.quantity').textContent);

            const existingItem = cart.find(item => item.id === itemId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ 
                    id: itemId, 
                    title: itemTitle, 
                    price: itemPrice, 
                    image: itemImage, 
                    quantity: quantity 
                });
            }

            saveCart();
            updateCartUI();
            
            if (cartNotification) {
                cartNotification.classList.add('active');
                setTimeout(() => {
                    cartNotification.classList.remove('active');
                }, 2000);
            }
        });
    });

    // Quantity controls in menu
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const quantityEl = selector.querySelector('.quantity');
        
        minusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityEl.textContent);
            if (quantity > 1) {
                quantityEl.textContent = quantity - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityEl.textContent);
            quantityEl.textContent = quantity + 1;
        });
    });

    // Cart quantity controls
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn')) {
            e.preventDefault();
            
            const cartItem = e.target.closest('.cart-item');
            const itemId = cartItem.querySelector('.remove-item').dataset.id;
            const quantitySpan = cartItem.querySelector('.quantity');
            let quantity = parseInt(quantitySpan.textContent);

            e.target.style.transform = 'scale(0.9)';
            setTimeout(() => e.target.style.transform = '', 200);

            if (e.target.classList.contains('minus')) {
                quantity = Math.max(1, quantity - 1);
            } else {
                quantity += 1;
            }

            const itemIndex = cart.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                cart[itemIndex].quantity = quantity;
                saveCart();
                updateCartUI();
            }
        }

        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            e.stopPropagation();
            const itemId = e.target.dataset.id || e.target.closest('.remove-item').dataset.id;
            cart = cart.filter(item => item.id !== itemId);
            saveCart();
            updateCartUI();
        }
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                alert('Order placed successfully!');
                cart = [];
                saveCart();
                updateCartUI();
                cartModal.classList.remove('active');
            }
        });
    }

    // ========== Authentication System ==========
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('login-btn');
    const closeAuth = document.querySelector('.close-auth');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    // Show auth modal
    if (loginBtn && authModal) {
        loginBtn.addEventListener('click', () => {
            authModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close auth modal
    if (closeAuth && authModal) {
        closeAuth.addEventListener('click', () => {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Tab switching
    if (tabBtns.length && authForms.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tabName = btn.getAttribute('data-tab');
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${tabName}Form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const response = await fetch('/api/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }
                
                localStorage.setItem('token', data.token);
                updateAuthUI(true);
                showNotification('Login successful!');
                authModal.style.display = 'none';
            } catch (error) {
                showNotification(error.message, true);
            }
        });
    }

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            try {
                const response = await fetch('/api/v1/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }
                
                localStorage.setItem('token', data.token);
                updateAuthUI(true);
                showNotification('Registration successful!');
                authModal.style.display = 'none';
            } catch (error) {
                showNotification(error.message, true);
            }
        });
    }

    // Check auth status on page load
    checkAuthStatus();

    // ========== Helper Functions ==========
    function updateAuthUI(isLoggedIn) {
        const loginBtn = document.getElementById('login-btn');
        const userProfileContainer = document.querySelector('.user-profile-container');
        
        if (!loginBtn) return;
        
        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            
            const token = localStorage.getItem('token');
            if (!token) return;
            
            if (!userProfileContainer) {
                const profileContainer = document.createElement('div');
                profileContainer.className = 'user-profile-container';
                loginBtn.parentNode.insertBefore(profileContainer, loginBtn.nextSibling);
            }
            
            try {
                const userData = JSON.parse(atob(token.split('.')[1]));
                
                document.querySelector('.user-profile-container').innerHTML = `
                    <div class="user-profile">
                        <div class="user-avatar">${userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}</div>
                        <span class="user-name">${userData.name || 'User'}</span>
                        <button id="logout-btn" class="btn btn-small">Logout</button>
                    </div>
                `;
                
                document.getElementById('logout-btn').addEventListener('click', logoutUser);
            } catch (error) {
                console.error('Error decoding token:', error);
                logoutUser();
            }
        } else {
            loginBtn.style.display = 'block';
            if (userProfileContainer) {
                userProfileContainer.remove();
            }
        }
    }

    async function logoutUser() {
        try {
            const response = await fetch('/api/v1/auth/logout', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                localStorage.removeItem('token');
                updateAuthUI(false);
                showNotification('Logged out successfully');
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            localStorage.removeItem('token');
            updateAuthUI(false);
            showNotification('Logged out successfully');
        }
    }

    async function checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (!token) {
            updateAuthUI(false);
            return;
        }
        
        try {
            const response = await fetch('/api/v1/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                updateAuthUI(true);
            } else {
                localStorage.removeItem('token');
                updateAuthUI(false);
            }
        } catch (error) {
            localStorage.removeItem('token');
            updateAuthUI(false);
        }
    }

    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : ''}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.display = 'block';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Initialize cart UI
    updateCartUI();

    // ========== Mobile Touch Improvements ==========
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('btn') || 
            e.target.classList.contains('qty-btn') ||
            e.target.classList.contains('add-to-cart')) {
            e.target.style.transform = 'scale(0.95)';
        }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('btn') || 
            e.target.classList.contains('qty-btn') ||
            e.target.classList.contains('add-to-cart')) {
            e.target.style.transform = '';
        }
    }, { passive: true });

    document.addEventListener('dblclick', function(e) {
        if (e.target.classList.contains('btn') || 
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA') {
            e.preventDefault();
        }
    });
});