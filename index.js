// Load environment variables first
require('dotenv').config();
try {
    if (!process.env.MONGO_URL || !process.env.PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('Required environment variables are not defined');
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

app.use('/auth', auth);
app.use('/package', package);

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