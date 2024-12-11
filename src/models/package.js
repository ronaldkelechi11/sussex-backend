const mongoose = require('mongoose')

const packageSchema = new mongoose.Schema({
    trackingId: String,
    senderName: String,
    senderAddress: String,
    senderEmailAddress: String,
    senderTelephone: String,
    receiverName: String,
    receiverAddress: String,
    receiverEmailAddress: String,
    receiverTelephone: String,
    originCountry: String,
    destinationCountry: String,
    shipingDate: String,
    expectedDeliveryDate: String,
    typeOfShipment: String,
    carrier: String,
    comments: String,
    status: Boolean,
    currentLocation: String,

    shipingContent: [{
        content: String,
        quantity: String,
        weight: String,
    }],

    shipingTracking: [{
        datetime: String,
        remark: String,
        location: String,
    }],
})


module.exports = mongoose.model("Package", packageSchema)