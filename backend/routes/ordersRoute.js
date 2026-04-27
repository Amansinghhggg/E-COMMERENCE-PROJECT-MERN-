import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../contorllers/ordersController.js";

import { userAuthorization, adminAuthorization } from "../middlewares/Authorization.js";

router
  .route("/")
  .post(userAuthorization, createOrder)
  .get(userAuthorization, adminAuthorization, getAllOrders);

router.route("/mine").get(userAuthorization, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(userAuthorization, findOrderById);
router.route("/:id/pay").put(userAuthorization, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(userAuthorization, adminAuthorization, markOrderAsDelivered);

export default router;