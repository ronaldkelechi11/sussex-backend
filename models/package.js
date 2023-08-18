const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        immutable: true
    },
    receiverName: {
        type: String,
        required: true,
    },
    receiverAddress: {
        type: String,
        required: true,
    },
    receiverEmailAddress: String,
    originCountry: {
        type: String,
        required: true,
    },
    destinationCountry: {
        type: String,
        required: true,
    },
    shipingDate: {
        type: String,
        required: true,
    },
    expectedDeliveryDate: {
        type: String,
        required: true,
    },
    paymentMode: String,
    typeOfShipment: String,
    shipingContent: [
        {
            content: String,
            quantity: String,
            weight: String,
        }
    ],
    shipingTracking: [
        {
            datetime: String,
            activity: String,
            location: String
        }
    ]
});


module.exports = mongoose.model("Package", packageSchema)