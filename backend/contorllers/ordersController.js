import Order from "../models/Order.js";
import Product from "../models/product.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing in environment variables");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.08;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const verifyRazorpaySignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay key secret is missing in environment variables");
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
};


const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const totalPriceNumber = Number(totalPrice);
    const amountInPaise = Math.round(totalPriceNumber * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      res.status(400);
      throw new Error("Invalid order amount");
    }

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${order._id.toString()}`,
      notes: {
        appOrderId: order._id.toString(),
        customerId: req.user._id.toString(),
      },
    });

    order.paymentResult = {
      id: razorpayOrder.id,
      status: razorpayOrder.status,
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    const createdOrder = await order.save();

    res.status(201).json({
      ...createdOrder.toObject(),
      razorpay: {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "E-Commerce Store",
        description: "Order payment",
        prefill: {
          name: req.user.name || req.user.username || "Customer",
          email: req.user.email,
        },
        theme: {
          color: "#0ea5e9",
        },
      },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const razorpayOrderId = req.body.razorpay_order_id;
      const razorpayPaymentId = req.body.razorpay_payment_id;
      const razorpaySignature = req.body.razorpay_signature;

      if (razorpayOrderId || razorpayPaymentId || razorpaySignature) {
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
          res.status(400);
          throw new Error("Incomplete Razorpay payment details");
        }

        const savedRazorpayOrderId = order.paymentResult?.id;
        if (savedRazorpayOrderId && savedRazorpayOrderId !== razorpayOrderId) {
          res.status(400);
          throw new Error("Razorpay order id mismatch");
        }

        const isValidSignature = verifyRazorpaySignature({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        });

        if (!isValidSignature) {
          res.status(400);
          throw new Error("Invalid Razorpay signature");
        }
      }

      const paymentId = req.body.id || req.body.razorpay_payment_id;
      const paymentStatus =
        req.body.status ||
        (req.body.razorpay_payment_id ? "captured" : undefined) ||
        "completed";
      const paymentUpdateTime =
        req.body.update_time || new Date().toISOString();
      const paymentEmail = req.body?.payer?.email_address || req.user.email;

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentId,
        status: paymentStatus,
        update_time: paymentUpdateTime,
        email_address: paymentEmail,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      error: error.message,
    });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};