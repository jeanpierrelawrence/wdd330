// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {parentElement.innerHTML = ``;}

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}
// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Retrieve cart from localStorage and sum quantities
export function getCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  return Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + (item.Quantity || 1), 0)
    : 0;
}

// Update text and trigger pop animation
export function updateCartCountBadge() {
  const badge = document.querySelector(".cart-count");
  if (!badge) return;

  const count = getCartCount();
  badge.textContent = count;

  if (count > 0) {
    badge.classList.remove("hide");
    badge.classList.remove("pop");
    void badge.offsetWidth; 
    badge.classList.add("pop");
  } else {
    badge.classList.add("hide");
  }
}