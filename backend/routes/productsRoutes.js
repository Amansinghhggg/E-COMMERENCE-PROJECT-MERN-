import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import { addProduct, updateProduct, removeProduct, 
fetchProductById ,fetchProducts, fetchAllProducts ,addProductReview, 
fetchTopProducts, fetchNewProducts, filterProducts}
from "../contorllers/productController.js";

import checkId from "../middlewares/checkId.js";
import { userAuthorization, adminAuthorization } from "../middlewares/Authorization.js";


router
  .route("/")
  .get(fetchProducts)
  .post(userAuthorization, adminAuthorization, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(userAuthorization, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(userAuthorization, adminAuthorization, formidable(), updateProduct)
  .delete(userAuthorization, adminAuthorization, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;