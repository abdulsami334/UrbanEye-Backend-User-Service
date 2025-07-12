const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/userRoute');

dotenv.config(); // ✅ Make sure this is at the top to load env variables

const app = express();

// ✅ Check env variables are present
if (!process.env.MONGO_URI || !process.env.PORT || !process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("❌ One or more required environment variables are missing");
  process.exit(1);
}

// ✅ CORS Setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://10.0.2.2:3000',
  'http://192.168.10.18:5000'
];

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

// ❌ You can remove this if you're not serving static uploads anymore:
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/users', authRoutes);

// ✅ MongoDB + Server
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

// ✅ Health route
app.get('/api/users/test', (req, res) => {
  res.send('✅ Mobile se backend chal gaya!');
});

// ✅ Optional graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log("🛑 MongoDB disconnected on app termination");
  process.exit(0);
});
