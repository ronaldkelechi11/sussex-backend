const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    id: String,
    owner: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    shipmentDate: {
        type: String,
        required: true,
    },
    expectedDeliveryDate: {
        type: String,
        required: true,
    },
    shipingContent: [
        {
            content: String,
            quantity: Number
        }
    ],
    shipingTracking: [
        {
            dt: String,
            activity: String,
            location: String
        }
    ]

});

module.exports = mongoose.model("Package", packageSchema)