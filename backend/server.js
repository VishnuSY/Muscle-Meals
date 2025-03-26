require('dotenv').config(); // Load .env FIRST
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Enhanced Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500' // Match your frontend URL
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// MongoDB Connection (Improved)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,       // Auto-retry writes
  w: 'majority'            // Write acknowledgment
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1); // Exit if DB connection fails
});

// Routes
app.use('/api', orderRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}/api`);
});