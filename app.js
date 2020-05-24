const express = require('express')
var cors = require('cors')

var bodyParser = require('body-parser')
const app = express()
app.set('view engine', 'ejs');
path = require("path");
const User = require('./models/user')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors())

var userRoutes = require("./routes/user");

var mealRoutes = require("./routes/meal");


app.get('/', (req, res) => {
    res.send("Home Page")
})

app.post('/', (req, res) => {
    console.log("post")
})

app.use(userRoutes);
app.use(mealRoutes);


const port = 8000
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
