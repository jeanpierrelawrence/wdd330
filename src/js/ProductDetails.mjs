import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.dataSource = dataSource;
        this.product = {};
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);

        this.renderProductDetails(this.product);

        document.getElementById('addToCart').addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails(product) {
        document.querySelector('#productBrand').textContent = product.Brand.Name;
        document.querySelector('#productName').textContent = product.NameWithoutBrand;

        const productImage = document.getElementById('productImage');
        productImage.src = product.Image;
        productImage.alt = product.NameWithoutBrand;

        document.getElementById('productPrice').textContent = `$${product.FinalPrice}`;
        document.getElementById('productColor').textContent = product.Colors[0].ColorName;
        document.getElementById('productDescription').innerHTML = product.DescriptionHtmlSimple;

        document.getElementById('addToCart').dataset.id = product.Id;
    }
}