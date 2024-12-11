const express = require('express')
const _package = require('../models/package')
const router = express.Router()

async function checkIfExists(trackingId) {
    const packageExists = await _package.findOne({ trackingId: trackingId })
    return !!packageExists;
}

// Create package
router.post('/', async (req, res) => {
    const package = req.body

    // To check if package already exists
    if (checkIfExists(package.trackingId)) {
        res.status(409).send('Conflict in Database: Package with that Tracking ID already Exists')
    }
    else {
        _package.create(package)
            .then((result) => {
                res.status(200).send(result)
            }).catch((err) => {
                res.status(500).send(err);
            });
    }
})

// Read All package
router.get('/', async (req, res) => {
    const package = await _package.find();
    res.send(package);
})

// Read particular package
router.get('/:trackingId', async (req, res) => {
    const trackingId = req.params.trackingId
    const package = await _package.find({ id: trackingId });

    if (!package) {
        res.status(404).send()
    }
    else {
        res.status(200).send(package);
    }
})

// Update package
router.put('/', async (req, res) => {
    const updates = req.body;

    try {
        const updatedDocument = await _package.findOneAndUpdate(
            { id: updates.id },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({
            message: 'Document updated successfully',
            data: updatedDocument,
        });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Delete All packages
router.delete('/', (req, res) => {
    _package.deleteMany()
        .then((result) => {
            res.status(200).send('Successful')
        }).catch((err) => {
            res.status(500)
        });
})


// Delete package
router.delete('/:id', (req, res) => {
    const trackingId = req.params.id

    _package.findOneAndDelete({ id: trackingId })
        .then((result) => {
            res.status(200).send(
                {
                    message: 'Success',
                    result
                })

        }).catch((err) => {
            res.status(500)
        });
})

module.exports = router