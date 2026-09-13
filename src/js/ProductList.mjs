import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();

        this.renderList(list)
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <div class="product-card__image-container">
        <img src="${product.Image}" alt="${product.NameWithoutBrand}" />
      </div>
      <hr class="product-card__divider" />
      <div class="product-card__content">
        <span class="card__brand">${product.Brand.Name}</span>
        <div class="product-card__row">
          <h3 class="card__name">${product.NameWithoutBrand}</h3>
          <span class="product-card__price-badge">$${product.FinalPrice}</span>
        </div>
      </div>
    </a>
  </li>`;
}