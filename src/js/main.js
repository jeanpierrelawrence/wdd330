import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCountBadge } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

updateCartCountBadge();

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, listElement);

productList.init();