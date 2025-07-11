const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/userRoute');

dotenv.config();
const app = express();

// Environment Variable Safety Check
if (!process.env.MONGO_URI || !process.env.PORT) {
  console.error("❌ MONGO_URI or PORT not set in .env");
  process.exit(1);
}

// Allowed origins for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://10.0.2.2:3000',
  'http://192.168.10.18:5000'
];

// CORS Setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Serve static uploads (e.g., profile images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', authRoutes);

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI, {
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000,
})
.then(() => {
  console.log("✅ MongoDB Connected");

  app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${process.env.PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});


app.get('/api/users/test', (req, res) => {
  res.send('✅ Mobile se backend chal gaya!');
});


// Graceful Shutdown (Optional)
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log("🛑 MongoDB disconnected on app termination");
  process.exit(0);
});
