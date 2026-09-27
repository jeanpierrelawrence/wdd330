import { setLocalStorage, getLocalStorage, updateCartCountBadge } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.Quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    this.calculateOrderTotal();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(this.outputSelector);
    if (!summaryElement) return;

    let totalCount = 0;
    let totalPrice = 0;

    this.list.forEach((item) => {
      const qty = item.Quantity || 1;
      totalCount += qty;
      totalPrice += item.FinalPrice * qty;
    });

    this.itemTotal = totalPrice;

    const numItemsEl = summaryElement.querySelector("#num-items");
    const subtotalEl = summaryElement.querySelector("#subtotal");

    if (numItemsEl) numItemsEl.innerText = totalCount;
    if (subtotalEl) subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    const totalCount = this.list.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );

    if (totalCount > 0) {
      this.shipping = 10 + (totalCount - 1) * 2;
      this.tax = this.itemTotal * 0.06;
      this.orderTotal = this.itemTotal + this.shipping + this.tax;
    } else {
      this.shipping = 0;
      this.tax = 0;
      this.orderTotal = 0;
    }

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summaryElement = document.querySelector(this.outputSelector);
    if (!summaryElement) return;

    const shippingEl = summaryElement.querySelector("#shipping");
    const taxEl = summaryElement.querySelector("#tax");
    const totalEl = summaryElement.querySelector("#orderTotal");

    if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(formElement) {
    const json = formDataToJSON(formElement);

    this.calculateOrderTotal();

    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal.toFixed(2);
    json.tax = this.tax.toFixed(2);
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    try {
      const services = new ExternalServices();
      const res = await services.checkout(json);

      setLocalStorage("so-cart", []);

      window.location.href = "/checkout/success.html";
      
      return res;
    } catch (err) {
      console.error("Checkout failed:", err);
      
      if (err.name === "servicesError") {
        const errorMessages = Object.values(err.message).join("\n");
        alert(`Order Submission Error:\n${errorMessages}`);
      } else {
        alert("An unexpected error occurred. Please check your information and try again.");
      }
    }
  }
}