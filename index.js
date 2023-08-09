const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const Package = require('./models/package');
const app = express()
const port = 3000

// Change these before deployment
const mongodbUrl = "mongodb://127.0.0.1:27017/sussexlogistics"
const ACCESS_POINT = "*"

// Middleware
app.use(express.json())
app.use(cors({
    origin: ACCESS_POINT
}))



// Admin login
app.post('/admin', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    // Wrong Email (400) and wrong password(400)
    if (email != "admin@sussexlogistics.net") {
        res.status(400).send()
    }
    if (password != "adminPassword") {
        res.status(400).send()
    }
    // Correct Email (200)
    else {
        console.log("Admin has logged In");
        res.status(200).send()
    }
})

//Add a new package Item
/* Get all the info then return the user id for the person
 */
app.post("/admin/add", (req, res) => {

})

// Edit a new Item
app.put("/admin/edit", (req, res) => {

})

// Fetch a particular user from the whole db
app.get("/track/:id", (req, res) => {
    var id = req.params.id

    Package.findOne({ id })
        .then((result) => {
            console.log(result);
            if (result == null) {
                res.status(400).send()
            }
            else {
                res.status(200).send(result)
            }
        }).catch((err) => {
            console.log(err);
        });
})

app.listen(port,
    () => {
        console.log(`App listening on port: ${port}`),
            mongoose.connect(mongodbUrl).then((result) => {
                console.log("Connected to MongoDB succesfully");
            }).catch((err) => {
                console.log(err);
            });
    }
)