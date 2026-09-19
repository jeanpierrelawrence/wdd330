import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

// Get category from URL (default to 'tents' if missing)
const category = getParam("category") || "tents";

// Update category section title
const titleElement = document.querySelector(".products h2");
if (titleElement) {
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
  titleElement.textContent = `Top Products: ${formattedCategory}`;
}

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

myList.init();