const express = require('express')
const mongoose = require('mongoose');
const _package = require('../../models/package')
const router = express.Router()

async function checkIfExists(id) {
    const packageExists = await _package.findOne({ id: id })
    return !!packageExists;
}

// Create invoice
router.post('/', async (req, res) => {
    const package = req.body

    if (checkIfExists(package.id)) {

    }
})

// Read All Invoice
router.get('/', (req, res) => {

})

// Read particular invoice
router.get('/:id', (req, res) => {
    const id = req.params.id
})

// Update Invoice
router.put('/', (req, res) => {

})

// Delete Invoice
router.delete('/', (req, res) => {

})

module.exports = router