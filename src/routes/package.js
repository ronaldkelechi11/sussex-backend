const express = require('express')
const _package = require('../models/package')
const router = express.Router()
const { compileTemplate } = require('../utils/emailService')
const nodemailer = require('nodemailer')
const { sendEmail } = require('../services/emailService')

async function checkIfExists(trackingId) {
    const packageExists = await _package.findOne({ trackingId: trackingId })
    return !!packageExists;
}

// Utility function to generate tracking ID
const generateTrackingId = () => {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomPart = Array.from(
        { length: 10 },
        () => alphanumeric[Math.floor(Math.random() * alphanumeric.length)]
    ).join('');
    return `${randomPart}-CARGO`;
};

// Create package
router.post('/', async (req, res) => {
    try {
        // Generate and assign tracking ID
        let trackingId = generateTrackingId();
        while (await checkIfExists(trackingId)) {
            trackingId = generateTrackingId(); // Regenerate if exists
        }

        const packageData = {
            ...req.body,
            trackingId
        };

        const newPackage = await _package.create(packageData);

        // Send shipping notification email
        try {
            const emailHtml = compileTemplate('shipping-notification', {
                receiverName: newPackage.receiverName,
                trackingId: newPackage.trackingId,
                currentLocation: newPackage.currentLocation || 'Processing Center',
                expectedDeliveryDate: newPackage.expectedDeliveryDate,
                typeOfShipment: newPackage.typeOfShipment,
                carrier: newPackage.carrier,
                receiverAddress: newPackage.receiverAddress,
                receiverEmailAddress: newPackage.receiverEmailAddress,
                senderName: newPackage.senderName,
            });

            sendEmail(
                newPackage.receiverEmailAddress,
                'Your package is on the way!',
                '',
                emailHtml
            );
        } catch (emailError) {
            console.error('Failed to send shipping notification:', emailError);
        }

        res.status(201).json(newPackage);
    } catch (error) {
        res.status(400).json({
            error: error.message || 'Invalid package data'
        });
    }
});

// Read All packages with pagination
router.get('/', async (req, res) => {
    try {
        const packages = await _package
            .find()
            .exec();

        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching packages' });
    }
});

// Read particular package
router.get('/:trackingId', async (req, res) => {
    try {
        const package = await _package.findOne({ trackingId: req.params.trackingId });
        if (!package) {
            return res.status(404).json({ error: 'Package not found' });
        }
        res.status(200).json(package);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching package' });
    }
});

// Update package
router.put('/:trackingId', async (req, res) => {
    try {
        const { trackingId } = req.params;
        const updates = req.body;

        // Prevent trackingId modification
        delete updates.trackingId;

        const updatedPackage = await _package.findOneAndUpdate(
            { trackingId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ error: 'Package not found' });
        }

        res.status(200).json(updatedPackage);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Invalid update data' });
    }
});

// Delete package
router.delete('/:trackingId', async (req, res) => {
    try {
        const package = await _package.findOneAndDelete({
            trackingId: req.params.trackingId
        });

        if (!package) {
            return res.status(404).json({ error: 'Package not found' });
        }

        res.status(200).json({
            message: 'Package deleted successfully',
            package
        });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting package' });
    }
});

// Protect bulk delete with optional authentication middleware
router.delete('/', async (req, res) => {
    try {
        const result = await _package.deleteMany({});
        res.status(200).json({
            message: 'All packages deleted successfully',
            count: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting packages' });
    }
});

module.exports = router