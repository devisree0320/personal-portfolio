const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminOnly } = require('../middleware/auth');

// Place order (user)
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, address } = req.body;
    const order = await Order.create({ user: req.user.id, items, total, address });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my orders (user)
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all orders (admin)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update order status (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
