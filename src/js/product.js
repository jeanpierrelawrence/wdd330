import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const productId = getParam("product");

const dataSource = new ProductData();
const product = new ProductDetails(productId, dataSource);

product.init();