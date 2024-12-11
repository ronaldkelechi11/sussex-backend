const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    // Throw bad request error
    if (email != process.env.ADMIN_EMAIL) {
        res.status(400).send()
    }
    if (password != process.env.ADMIN_PASSWORD) {
        res.status(400).send()
    }

    // Correct Email (200)
    else {
        console.log("Admin has logged In");
        res.status(200).send()
    }
})

module.exports = router