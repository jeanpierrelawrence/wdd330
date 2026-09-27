import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    if (zipInput.value.trim() !== "") {
      myCheckout.calculateOrderTotal();
    }
  });
}

const form = document.forms["checkout"];
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const chkStatus = form.checkValidity();
    form.reportValidity();

    if (chkStatus) {
      myCheckout.checkout(form);
    }
  });
}