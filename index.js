const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// Change these before deployment
const mongodbLiveUrl = process.env.MONGO_URL
const auth = require('./src/routes/auth')
const invoice = require('./src/routes/invoice')

// Endpoint declaraction
app.use('/auth', auth)
app.use('/invoice', invoice)

app.listen(port,
    () => {
        console.log(`API listening on port: ${port}`)
        mongoose.connect(mongodbLiveUrl).then((result) => {
            console.log("Connected to MongoDB succesfully");
        }).catch((err) => {
            console.log(err);
        });
    }
)