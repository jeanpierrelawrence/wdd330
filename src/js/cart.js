import { getLocalStorage, setLocalStorage, loadHeaderFooter, updateCartCountBadge } from "./utils.mjs";

loadHeaderFooter();

function getGroupedCart() {
  const rawCart = getLocalStorage("so-cart") || [];
  const grouped = [];

  rawCart.forEach((item) => {
    const existing = grouped.find((g) => g.Id === item.Id);
    if (existing) {
      existing.Quantity = (existing.Quantity || 1) + (item.Quantity || 1);
    } else {
      grouped.push({ ...item, Quantity: item.Quantity || 1 });
    }
  });

  return grouped;
}

function renderCartContents() {
  const cartItems = getGroupedCart();
  const listElement = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");

  if (!cartItems.length) {
    listElement.innerHTML = `
      <li class="cart-empty">
        <p>Your cart is empty.</p>
        <a href="/index.html" class="btn">Explore Products</a>
      </li>`;
    if (cartFooter) cartFooter.classList.add("hide");
    return;
  }

  if (cartFooter) cartFooter.classList.remove("hide");

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  listElement.innerHTML = htmlItems.join("");

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * item.Quantity,
    0
  );
  const totalElement = document.querySelector(".cart-total");
  if (totalElement) {
    totalElement.textContent = `Total: $${grandTotal.toFixed(2)}`;
  }
}

function cartItemTemplate(item) {
  const imgSrc = item.Images?.PrimaryMedium || item.Image || "";
  const brandName = item.Brand?.Name || "";
  const itemName = item.NameWithoutBrand || item.Name || "Product";
  const itemPrice = Math.round(item.FinalPrice);

  return `
  <li class="cart-card">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${imgSrc}" alt="${itemName}" />
    </a>

    <div class="cart-card__details">
      <span class="card__brand">${brandName}</span>
      <a href="/product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${itemName}</h2>
      </a>
      <span class="cart-card__price-badge">$${itemPrice}</span>
    </div>

    <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove item">
      <img src="../public/images/bin.svg" alt="Remove item" />
    </button>

    <div class="cart-card__quantity-controls">
      <button class="btn-qty btn-plus" data-id="${item.Id}">+</button>
      <span class="cart-card__quantity">${item.Quantity}</span>
      <button class="btn-qty btn-minus" data-id="${item.Id}">-</button>
    </div>
  </li>`;
}

document.querySelector(".product-list").addEventListener("click", (e) => {
  const target = e.target;
  const id = target.dataset.id;
  if (!id) return;

  const rawCart = getLocalStorage("so-cart") || [];

  if (target.classList.contains("cart-card__remove")) {
    const updatedCart = rawCart.filter((item) => item.Id !== id);
    setLocalStorage("so-cart", updatedCart);
  } else if (target.classList.contains("btn-plus")) {
    const itemToAdd = rawCart.find((item) => item.Id === id);
    if (itemToAdd) rawCart.push(itemToAdd);
    setLocalStorage("so-cart", rawCart);
  } else if (target.classList.contains("btn-minus")) {
    const index = rawCart.findIndex((item) => item.Id === id);
    if (index !== -1) {
      rawCart.splice(index, 1);
    }
    setLocalStorage("so-cart", rawCart);
  } else {
    return;
  }

  renderCartContents();
  updateCartCountBadge();
});

renderCartContents();