const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Item name is required'] 
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative'] 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, 'Minimum quantity is 1'] 
  }
});

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Delivery address is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Invalid phone number format']
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD'
  },
  cartItems: {
    type: [cartItemSchema],
    validate: {
      validator: v => v.length > 0,
      message: 'Cart cannot be empty'
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Delivered'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);