// Load environment variables first
require('dotenv').config();
try {
    if (!process.env.MONGO_URL || !process.env.PORT) {
        throw new Error('Required environment variables MONGO_URL and PORT must be defined.');
    }
    if (!process.env.RESEND_API_KEY) {
        console.warn('Warning: RESEND_API_KEY is not set. Email sending via Resend will fail until configured.');
    }
} catch (error) {
    console.error('Configuration error:', error.message);
    process.exit(1);
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

// Enhanced middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
const auth = require('./src/routes/auth');
const package = require('./src/routes/package');
const email = require('./src/routes/email');

app.use('/auth', auth);
app.use('/package', package);
app.use('/emails', email);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// MongoDB connection with retry logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Start server only after DB connection
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`API listening on port: ${port}`);
    });
});