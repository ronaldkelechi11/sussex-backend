const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const Package = require('./models/package');
const app = express()
const port = 3000

// Change these before deployment
const mongodbUrl = "mongodb+srv://ronaldkelechi11:yDYQuArX0twiC7Mr@firstcluster.ywmpwva.mongodb.net/?retryWrites=true&w=majority"
const ACCESS_POINT = "https://sussex-logistics.vercel.app/"

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
    const myPackage = new Package(req.body.myObject)
    myPackage.save()
        .then((result) => {
            console.log("New Package Saved");
            res.status(200).send()
        }).catch((err) => {
            res.status(500).send()
            console.log(err);
        });
})

// fetch the Item to be updated
app.post("/admin/edit", (req, res) => {
    var trackingCode = req.body.trackingCode
    Package.findOne({ id: trackingCode })
        .then((result) => {
            if (result != null) {
                res.status(200).send(result)
            }
            else {
                res.status(404)
            }
        }).catch((err) => {
            res.send(500)
            console.log(err);
        });
})


//Updating the package item
app.put("/admin/edit", (req, res) => {
    var id = req.body.id
    var myObject = req.body.myObject

    Package.findOneAndUpdate({ id: id }, { shipingTracking: myObject.shipingTracking })
        .then((result) => {
            res.status(200).send()
        }).catch((err) => {
            console.log(err);
            res.status(500).send()
        });
})

// Fetch a particular user from the whole db
app.get("/track/:id", (req, res) => {
    var id = req.params.id

    Package.findOne({ id })
        .then((result) => {
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