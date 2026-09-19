import { getLocalStorage, setLocalStorage, updateCartCountBadge } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);

    updateCartCountBadge();
  }

  renderProductDetails() {
    document.querySelector("#productBrand").textContent = this.product.Brand.Name;
    document.querySelector("#productName").textContent = this.product.NameWithoutBrand;

    const img = document.querySelector("#productImage");
    if (img) {
      img.src = this.product.Images.PrimaryLarge;
      img.alt = this.product.NameWithoutBrand;
    }

    document.querySelector("#productPrice").textContent = `$${this.product.FinalPrice}`;
    document.querySelector("#productColor").textContent =
      this.product.Colors[0]?.ColorName || "";
    document.querySelector("#productDescription").innerHTML =
      this.product.DescriptionHtmlSimple;

    const button = document.querySelector("#addToCart");
    if (button) {
      button.dataset.id = this.product.Id;
    }
  }
}