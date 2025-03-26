const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.post('/order', async (req, res) => {
  try {
    const { name, address, phone, paymentMethod, cartItems } = req.body;
    
    if (!name || !address || !phone || !cartItems?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const total = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    const order = new Order({
      name,
      address,
      phone,
      paymentMethod: paymentMethod || 'COD',
      cartItems,
      total
    });

    await order.save();
    
    res.status(201).json({
      success: true,
      orderId: order._id,
      total: order.total
    });

  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ 
      error: 'Failed to place order',
      details: error.message 
    });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
});

module.exports = router;