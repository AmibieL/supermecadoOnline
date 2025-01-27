const products = {
  mercearia: [
    {
      id: 1,
      name: "Açucar",
      price: 4.99,
      image: "../img/açucar.webp",
      category: "mercearia",
    },
    {
      id: 2,
      name: "Feijão",
      price: 4.5,
      image: "../img/feijao.webp",
      category: "mercearia",
    },
    {
      id: 3,
      name: "Arroz",
      price: 5.99,
      image: "../img/arroz.webp",
      category: "mercearia",
    },
    {
      id: 4,
      name: "Sal",
      price: 3.99,
      image: "../img/sal.webp",
      category: "mercearia",
    },
    {
      id: 5,
      name: "Oleo de Soja",
      price: 2.99,
      image: "../img/oleo de soja.webp",
      category: "mercearia",
    },
    {
      id: 6,
      name: "Cafe",
      price: 222.99,
      image: "../img/cafe.webp",
      category: "mercearia",
    },
  ],
  hortifruti: [
    {
      id: 7,
      name: "Maçã",
      price: 2.99,
      image: "../img/maça.webp",
      category: "hortifruti",
    },
    {
      id: 8,
      name: "Laranja",
      price: 4.99,
      image: "../img/laranja.webp",
      category: "hortifruti",
    },
  ],
  higiene: [
    {
      id: 9,
      name: "Sabonete",
      price: 2.5,
      image: "../img/sabonete.webp",
      category: "higiene",
    },
    {
      id: 10,
      name: "Shampoo",
      price: 12.99,
      image: "../img/shampoo.webp",
      category: "higiene",
    },
    {
      id: 11,
      name: "Creme dental",
      price: 2.99,
      image: "../img/pasta de dente.webp",
      category: "higiene",
    },
    {
      id: 12,
      name: "Brilha aluminio",
      price: 3.99,
      image: "../img/brilha aluminio.webp",
      category: "higiene",
    },
    {
      id: 13,
      name: "Limpol",
      price: 4.99,
      image: "../img/limpol.webp",
      category: "higiene",
    },
  ],
  bebidas: [
    {
      id: 14,
      name: "Coca-Cola",
      price: 9.99,
      image: "../img/coca cola.webp",
      category: "bebidas",
    },
    {
      id: 15,
      name: "Cerveja Skol",
      price: 48.99,
      image: "../img/skol.webp",
      category: "bebidas",
    },
  ],
  frios: [
    {
      id: 16,
      name: "Queijo Mussarela",
      price: 32.99,
      image: "../img/queijo.webp",
      category: "frios",
    },
    {
      id: 17,
      name: "Presunto",
      price: 28.99,
      image: "../img/presunto.webp",
      category: "frios",
    },
  ],
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsContainer = document.getElementById("products-container");
const cartIcon = document.querySelector(".cart-icon");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeCartBtn = document.querySelector(".close-cart");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.querySelector(".checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutForm = document.getElementById("checkout-form");
const searchInput = document.getElementById("search");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

document.addEventListener("DOMContentLoaded", () => {
  displayProducts("all");
  updateCartCount();
});

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = e.target.dataset.category;
    displayProducts(category);
    navLinks.classList.remove("show");
  });
});

function openCart() {
  cartSidebar.classList.add("open");
}

function closeCart() {
  cartSidebar.classList.remove("open");
}

cartIcon.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cartSidebar.classList.contains("open")) {
    closeCart();
  }
});

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filterProducts(searchTerm);
});

function displayProducts(category) {
  productsContainer.innerHTML = "";
  let productsToShow = [];

  if (category === "all") {
    Object.values(products).forEach((categoryProducts) => {
      productsToShow = [...productsToShow, ...categoryProducts];
    });
  } else {
    productsToShow = products[category] || [];
  }

  productsToShow.forEach((product) => {
    const productElement = createProductElement(product);
    productsContainer.appendChild(productElement);
  });
}

function createProductElement(product) {
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">R$ ${product.price.toFixed(2)}</p>
        <div class="quantity-controls">
            <button class="quantity-btn minus">-</button>
            <input type="number" min="1" value="1" class="quantity-input">
            <button class="quantity-btn plus">+</button>
        </div>
        <button class="add-to-cart" data-id="${product.id}">
            Adicionar ao Carrinho
        </button>
    `;

  const quantityInput = div.querySelector(".quantity-input");
  const minusBtn = div.querySelector(".minus");
  const plusBtn = div.querySelector(".plus");

  minusBtn.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  plusBtn.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });

  quantityInput.addEventListener("change", () => {
    if (quantityInput.value < 1) {
      quantityInput.value = 1;
    }
  });

  div.querySelector(".add-to-cart").addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    addToCart(product, quantity);
  });

  return div;
}

function filterProducts(searchTerm) {
  const allProducts = [];
  Object.values(products).forEach((categoryProducts) => {
    allProducts.push(...categoryProducts);
  });

  const filtered = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  productsContainer.innerHTML = "";
  filtered.forEach((product) => {
    const productElement = createProductElement(product);
    productsContainer.appendChild(productElement);
  });
}

function addToCart(product, quantity = 1) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  updateCart();
  updateCartCount();
  saveCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                <div class="cart-quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" min="1" value="${
                      item.quantity
                    }" class="quantity-input">
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="remove-btn">Remover</button>
            </div>
        `;

    const quantityInput = div.querySelector(".quantity-input");
    const minusBtn = div.querySelector(".minus");
    const plusBtn = div.querySelector(".plus");
    const removeBtn = div.querySelector(".remove-btn");

    minusBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        updateCartItemQuantity(item.id, item.quantity - 1);
      }
    });

    plusBtn.addEventListener("click", () => {
      updateCartItemQuantity(item.id, item.quantity + 1);
    });

    quantityInput.addEventListener("change", () => {
      const newQuantity = parseInt(quantityInput.value);
      if (newQuantity >= 1) {
        updateCartItemQuantity(item.id, newQuantity);
      } else {
        quantityInput.value = item.quantity;
      }
    });

    removeBtn.addEventListener("click", () => {
      removeFromCart(item.id);
    });

    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
}

function updateCartItemQuantity(productId, newQuantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    updateCart();
    updateCartCount();
    saveCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
  updateCartCount();
  saveCart();
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector(".cart-count").textContent = count;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  checkoutModal.style.display = "block";
  closeCart();
});

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const customerData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    payment: formData.get("payment"),
  };

  const message = formatWhatsAppMessage(customerData);
  const whatsappNumber = "5511999999999";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, "_blank");

  cart = [];
  saveCart();
  updateCart();
  updateCartCount();
  checkoutModal.style.display = "none";
});

function formatWhatsAppMessage(customerData) {
  let message = `*Novo Pedido*\n\n`;
  message += `*Cliente:* ${customerData.name}\n`;
  message += `*Telefone:* ${customerData.phone}\n`;
  message += `*Endereço:* ${customerData.address}\n`;
  message += `*Forma de Pagamento:* ${customerData.payment}\n\n`;
  message += `*Pedido:*\n`;

  cart.forEach((item) => {
    message += `${item.quantity}x ${item.name} - R$ ${(
      item.price * item.quantity
    ).toFixed(2)}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\n*Total: R$ ${total.toFixed(2)}*`;

  return message;
}

window.addEventListener("click", (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.style.display = "none";
  }
});
