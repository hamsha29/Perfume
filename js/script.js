const WHATSAPP_NUMBER = "923022042495";
const CART_KEY = "luxuryJCart";

const products = [
  {
    id: "noir-essence",
    name: "Noir Essence",
    description: "A dark blend of bergamot, leather, amber, and smooth woods.",
    price: 12900,
    image: "assets/images/noir-essence.jpg"
  },
  {
    id: "velvet-oud",
    name: "Velvet Oud",
    description: "Rich oud layered with saffron, rose, incense, and warm musk.",
    price: 14900,
    image: "assets/images/velvet-oud.jpg"
  },
  {
    id: "white-musk",
    name: "White Musk",
    description: "A clean and elegant composition of musk, iris, and soft woods.",
    price: 9900,
    image: "assets/images/white-musk.jpg"
  },
  {
    id: "imperial-rose",
    name: "Imperial Rose",
    description: "A sophisticated rose fragrance with vanilla, amber, and spice.",
    price: 11900,
    image: "assets/images/imperial-rose.jpg"
  },
  {
    id: "midnight-amber",
    name: "Midnight Amber",
    description: "Warm amber, vanilla, tonka bean, and precious dark woods.",
    price: 13500,
    image: "assets/images/midnight-amber.jpg"
  },
  {
    id: "silver-vanille",
    name: "Silver Vanille",
    description: "Soft vanilla, citrus, sandalwood, and refined white musk.",
    price: 10900,
    image: "assets/images/silver-vanille.jpg"
  }
];

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function formatPrice(price) {
  return `PKR ${price.toLocaleString("en-PK")}`;
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((total, item) => {
    const product = products.find((itemProduct) => itemProduct.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function updateCartCount() {
  document.querySelectorAll(".cart-count").forEach((element) => {
    element.textContent = getCartQuantity();
  });
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  updateCartCount();
  showNotification("Product added to your cart.");
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
  renderCheckout();
}

function changeQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartCount();
  renderCart();
  renderCheckout();
}

function buyNow(productId) {
  addToCart(productId);
  window.location.href = "checkout.html";
}

function createProductCard(product) {
  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <strong class="product-price">${formatPrice(product.price)}</strong>

        <div class="product-actions">
          <button class="btn btn-dark add-cart-button" data-id="${product.id}">
            ADD TO CART
          </button>
          <button class="btn btn-outline-dark buy-now-button" data-id="${product.id}">
            BUY NOW
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const shopContainer = document.getElementById("shop-products");
  const featuredContainer = document.getElementById("featured-products");

  if (shopContainer) {
    shopContainer.innerHTML = products.map(createProductCard).join("");
  }

  if (featuredContainer) {
    featuredContainer.innerHTML = products
      .slice(0, 3)
      .map(createProductCard)
      .join("");
  }

  document.querySelectorAll(".add-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.id);
    });
  });

  document.querySelectorAll(".buy-now-button").forEach((button) => {
    button.addEventListener("click", () => {
      buyNow(button.dataset.id);
    });
  });
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-message">
        Your cart is currently empty.<br><br>
        <a href="shop.html" class="btn btn-dark">SHOP PERFUMES</a>
      </div>
    `;

    if (checkoutButton) {
      checkoutButton.style.pointerEvents = "none";
      checkoutButton.style.opacity = "0.45";
    }
  } else {
    cartContainer.innerHTML = cart.map((cartItem) => {
      const product = products.find((item) => item.id === cartItem.id);

      if (!product) return "";

      return `
        <article class="cart-item">
          <img class="cart-item-image" src="${product.image}" alt="${product.name}">

          <div>
            <h3>${product.name}</h3>
            <p>${formatPrice(product.price)} each</p>

            <div class="quantity-controls">
              <button class="decrease-button" data-id="${product.id}">−</button>
              <span>${cartItem.quantity}</span>
              <button class="increase-button" data-id="${product.id}">+</button>
            </div>

            <button class="remove-item" data-id="${product.id}">
              Remove
            </button>
          </div>

          <strong class="cart-item-price">
            ${formatPrice(product.price * cartItem.quantity)}
          </strong>
        </article>
      `;
    }).join("");

    if (checkoutButton) {
      checkoutButton.style.pointerEvents = "auto";
      checkoutButton.style.opacity = "1";
    }

    document.querySelectorAll(".decrease-button").forEach((button) => {
      button.addEventListener("click", () => {
        changeQuantity(button.dataset.id, -1);
      });
    });

    document.querySelectorAll(".increase-button").forEach((button) => {
      button.addEventListener("click", () => {
        changeQuantity(button.dataset.id, 1);
      });
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", () => {
        removeFromCart(button.dataset.id);
      });
    });
  }

  const subtotal = getCartSubtotal();

  if (subtotalElement) {
    subtotalElement.textContent = formatPrice(subtotal);
  }

  if (totalElement) {
    totalElement.textContent = formatPrice(subtotal);
  }
}

function renderCheckout() {
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");

  if (!checkoutItems) return;

  if (cart.length === 0) {
    checkoutItems.innerHTML = `
      <div class="empty-message">
        Your cart is empty. <a href="shop.html">Shop now</a>.
      </div>
    `;
  } else {
    checkoutItems.innerHTML = cart.map((cartItem) => {
      const product = products.find((item) => item.id === cartItem.id);

      if (!product) return "";

      return `
        <div class="checkout-item">
          <span>${product.name} × ${cartItem.quantity}</span>
          <strong>${formatPrice(product.price * cartItem.quantity)}</strong>
        </div>
      `;
    }).join("");
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = formatPrice(getCartSubtotal());
  }
}

function createWhatsAppMessage(customer) {
  const productLines = cart.map((cartItem) => {
    const product = products.find((item) => item.id === cartItem.id);
    return `${product.name} × ${cartItem.quantity}`;
  }).join("\n");

  return `LUXURY J ORDER

Customer Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
City: ${customer.city}
Email: ${customer.email}

Products:
${productLines}

Total: ${formatPrice(getCartSubtotal())}`;
}

function setupCheckout() {
  const checkoutForm = document.getElementById("checkout-form");

  if (!checkoutForm) return;

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      const status = document.getElementById("checkout-status");
      status.textContent = "Please add at least one product before placing your order.";
      return;
    }

    const customer = {
      name: document.getElementById("customer-name").value.trim(),
      phone: document.getElementById("customer-phone").value.trim(),
      email: document.getElementById("customer-email").value.trim(),
      address: document.getElementById("customer-address").value.trim(),
      city: document.getElementById("customer-city").value.trim()
    };

    const message = createWhatsAppMessage(customer);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  });
}

function setupContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const status = document.getElementById("contact-status");
    status.textContent = "Thank you. Your message has been received.";

    contactForm.reset();
  });
}

function setupMobileNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });
}

function showNotification(message) {
  const notification = document.createElement("div");

  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.right = "20px";
  notification.style.bottom = "20px";
  notification.style.zIndex = "100";
  notification.style.padding = "15px 20px";
  notification.style.background = "#000000";
  notification.style.color = "#ffffff";
  notification.style.fontSize = "13px";
  notification.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProducts();
  renderCart();
  renderCheckout();
  setupCheckout();
  setupContactForm();
  setupMobileNavigation();
});
