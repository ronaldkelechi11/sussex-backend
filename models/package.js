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
    receiverEmailAddress: {
        type: String,
    },
    originCountry: {
        type: String,
        required: true,
    },
    destinationCountry: {
        type: String,
        required: true,
    },
    shipmentDate: {
        type: String,
        required: true,
    },
    typeOfShipment: String,
    expectedDeliveryDate: {
        type: String,
        required: true,
    },
    paymentMode: String,
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