const mongoose = require('mongoose');

const receivedEmailSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: [String],
        required: true
    },
    subject: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    html: {
        type: String,
        default: ''
    },
    raw: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    receivedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ReceivedEmail', receivedEmailSchema);
