const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected Successfully"))
    .catch(err => console.log("❌ Database Connection Error:", err));

// Link Routes
app.use('/api/claims', require('./routes/claimRoutes'));

// Basic Test Route
app.get('/', (req, res) => res.send("Insurance Fraud Backend is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});