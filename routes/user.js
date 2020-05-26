var express = require("express");
const multer = require('multer');
const upload = multer();
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User_functions = require('../controller/user_controller');
const app = express()
var session = require('express-session')

router.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}))

router.get("/users", function (req, res) {
    User_functions.getAllUsers()
        .then((users) => {
            console.log("Rrturning users list !!")
            return res.json(users)
        })
        .catch(err => {
            return res.json({ error :err})
        })

});
router.get("/users/:id",User_functions.requiresLogin, function (req, res) {
    console.log(typeof req.params.id)
    User_functions.getUserById(req.params.id)
        .then(user => {
            return res.json(user)
        })
        .catch(err => {
            return res.status(400).json({error:err})
        })
});


router.post("/users", upload.none(), function (req, res) {
    const curr_name = req.body.name
    const curr_email = req.body.email
    const curr_password = req.body.password
    const curr_total_calories = req.body.total_calories
    const hashed_password = bcrypt.hashSync(curr_password, saltRounds);
    // User_functions.addUser(curr_name, curr_email, curr_password, curr_total_calories)
    //     .then(() => {
    //         return res.redirect("/users")
    //     })
    //     .catch(err => {
    //         console.log("addUser error : ",err)
    //         return res.status(400).json({error : err})
    //     })
    User.findOne({
        where: {
            email: curr_email
        }
    })
    .then(user => {
        if (user ) {
            return res.status(400).json({error:"Email already exists"})
        }
        User.create({
            name: curr_name,
            email: curr_email,
            password: hashed_password,
            max_calories: curr_total_calories
        })
        .then(user => {
            return res.redirect("/login")
        })
    })
    .catch(err => {
        return res.status(400).json({error:err})
    })
});
router.put("/users/:id", upload.none(),User_functions.requiresLogin, function (req, res) {
    const user_id = req.params.id
    const curr_email = req.body.email
    const curr_password = req.body.password
    const curr_total_calories = req.body.total_calories
    const curr_current_calories = req.body.current_calories
    console.log(curr_total_calories)
    User.update({
            current_calories: curr_current_calories
        }, {
            where: {
                user_id: user_id
            }
        })
        .then(() => {
            return res.redirect("/users")
        })
        .catch(err => {
            return res.send(err)
        })
});


router.delete("/users/:id",User_functions.requiresLogin, function (req, res) {
    const user_id = req.params.id
    User.destroy({
            where: {
                user_id: user_id
            }
        })
        .then(() => {
            return res.redirect("/users")
        })
        .catch(err => {
            return res.send(err)
        })
});

router.post("/login", upload.none(), async function (req, res) {
    console.log("API");
    const curr_email = req.body.email
    const curr_password = req.body.password
    
    let login_res = await User_functions.loginUser(req, curr_email, curr_password)
    if (login_res == -1 || login_res == false) {
        return res.send({error:"Wrong username or password"})
    }
    req.session.LoggedIn = true
    req.session.user_id = login_res['user_id']
    console.log("Successfully logged in !!!")
    return res.redirect("/users")
});




router.post('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/users');
            }
        });
    }
});
module.exports = router;