const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Personal Notes & Bookmark Manager API');
});

const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);

const bookmarkRoutes = require('./routes/bookmarkRoutes');
app.use('/api/bookmarks', bookmarkRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
  
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

module.exports=app
