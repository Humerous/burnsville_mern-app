import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

const roundCurrency = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

// <---- ADD ORDERS ITEMS ---->
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const authoritativeItems = [];

      for (const item of orderItems) {
        const qty = Number(item.qty);

        if (!Number.isInteger(qty) || qty <= 0) {
          res.status(400);
          throw new Error('Order item quantity must be a positive integer');
        }

        if (!mongoose.Types.ObjectId.isValid(item.product)) {
          res.status(404);
          throw new Error('Product not found');
        }

        const product = await Product.findById(item.product).session(session);

        if (!product) {
          res.status(404);
          throw new Error('Product not found');
        }

        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: product._id,
            countInStock: { $gte: qty },
          },
          {
            $inc: { countInStock: -qty },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          res.status(400);
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        authoritativeItems.push({
          name: product.name,
          qty,
          image: product.image,
          price: product.price,
          product: product._id,
        });
      }

      const itemsPrice = roundCurrency(
        authoritativeItems.reduce(
          (total, item) => total + item.price * item.qty,
          0
        )
      );
      const shippingPrice = itemsPrice > 100 ? 0 : 100;
      const vatPrice = roundCurrency(itemsPrice * 0.15);
      const totalPrice = roundCurrency(
        itemsPrice + shippingPrice + vatPrice
      );

      const order = new Order({
        orderItems: authoritativeItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        vatPrice,
        shippingPrice,
        totalPrice,
      });

      createdOrder = await order.save({ session });
    });
  } catch (error) {
    if (
      error &&
      /transaction numbers are only allowed|replica set member or mongos/i.test(
        error.message
      )
    ) {
      res.status(503);
      throw new Error('Order processing is temporarily unavailable');
    }

    throw error;
  } finally {
    await session.endSession();
  }

  if (!createdOrder) {
    res.status(500);
    throw new Error('Order could not be created');
  }

  res.status(201).json(createdOrder);
});

// <---- GET ALL ORDER ITEMS ---->
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    const orderUserId =
      order.user && order.user._id
        ? order.user._id.toString()
        : order.user && order.user.toString();
    const isOwner = orderUserId === req.user._id.toString();

    if (!isOwner && !req.user.isAdmin) {
      res.status(403);
      throw new Error('Not authorized to access this order');
    }

    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// <---- UPDATE ORDER ITEMS BY Ids - if paid ---->
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // <---- UPDATE ORDER AND SAVE ---->
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// <---- UPDATE ORDER ITEMS BY Ids - if DELIVERED ---->
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// <---- GET MY ORDER ITEMS  ---->
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// <---- GET ORDER ITEMS  ---->
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// <---- EXPORT  ---->
export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
