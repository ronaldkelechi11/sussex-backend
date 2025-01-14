const mongoose = require('mongoose');

const shipingContentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content description is required'],
    trim: true
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required'],
    trim: true
  },
  weight: {
    type: String,
    required: [true, 'Weight is required'],
    trim: true,
    match: [/^\d+(\.\d+)?\s*(kg|lbs)$/i, 'Weight must include unit (kg or lbs)']
  }
});

const shipingTrackingSchema = new mongoose.Schema({
  datetime: {
    type: Date,
    required: [true, 'DateTime is required']
  },
  remark: {
    type: String,
    required: [true, 'Tracking remark is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  }
});

const packageSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: [true, 'Tracking ID is required'],
        unique: true,
        immutable: true,
        trim: true,
        index: true
    },
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
    packageValue: String,
    carrier: {
        type: String,
        default: "SUSSEX Cargo",
        immutable: true,
    },
    comments: String,
    status: {
        type: Boolean,
        default: true,
        index: true
    },
    currentLocation: {
        type: String,
        required: [true, 'Current location is required'],
        trim: true
    },
    shipingContent: [shipingContentSchema],
    shipingTracking: [shipingTrackingSchema]
}, {
    timestamps: true,
    versionKey: false
});

// Create compound index for common queries
packageSchema.index({ status: 1, trackingId: 1 });

// Add middleware for data sanitization
packageSchema.pre('save', function(next) {
    // Convert email addresses to lowercase
    if (this.senderEmailAddress) {
        this.senderEmailAddress = this.senderEmailAddress.toLowerCase();
    }
    if (this.receiverEmailAddress) {
        this.receiverEmailAddress = this.receiverEmailAddress.toLowerCase();
    }
    next();
});

module.exports = mongoose.model("Package", packageSchema);