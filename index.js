const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()
const port = 3000
const mongodbUrl = "mongodb://127.0.0.1:27017/sussexlogistics"

// Middleware
app.use(express.json())
app.use(cors({
    origin: "*"
}))


// Admin login
app.post('/admin', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    console.log("Admin is Trying to log in");

    // Wrong Email and wrong password
    if (email != "admin@sussexlogistics.net") {
        console.log("Wrong Email");
    }
    if (password != "adminpassword") {
        console.log("Wrong Password");
    }
    else {
        console.log("Admin has logged In");
    }
    console.log(email, password);
})

// Fetch a particular user from the whole db
app.get("/track/:id", (req, res) => {
    var id = req.params.id
})

app.listen(port,
    () => {
        console.log(`App listening on port ${port}`),
            mongoose.connect(mongodbUrl).then((result) => {
                console.log("Connected to MongoDB succesfully");
            }).catch((err) => {
                console.log(err);
            });
    }
)