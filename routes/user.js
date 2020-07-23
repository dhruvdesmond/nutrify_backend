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
const jwt = require('jsonwebtoken');

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000,
        secure: false

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
    const isAuthorised = User_functions.authorise(req,res,req.params.id)
    if(!isAuthorised){
        return res.status(403).json({error:"You are not authorised !!"})
    }
    User_functions.getUserById(req.params.id)
        .then(user => {
            return res.json(user)
        })
        .catch(err => {
            return res.status(403).json({error:err})
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
            return res.status(200).json(user)
        })
    })
    .catch(err => {
        return res.status(400).json({error:err})
    })
});
router.put("/users/:id", upload.none(),User_functions.requiresLogin, function (req, res) {
    const isAuthorised = User_functions.authorise(req,res,req.params.id)
    if(!isAuthorised){
        return res.status(403).json({error:"You are not authorised !!"})
    }
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
    const isAuthorised = User_functions.authorise(req,res,req.params.id)
    if(!isAuthorised){
        return res.status(403).json({error:"You are not authorised !!"})
    }
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
    const curr_email = req.body.email
    const curr_password = req.body.password
    
    let login_res = await User_functions.loginUser(req, curr_email, curr_password)
    if (login_res == -1 || login_res == false) {
        return res.send({error:"Wrong username or password"})
    }

    const jwt_token = generateJWTToken(login_res.toJSON())
    console.log(jwt_token)
    return res.header('auth_token',jwt_token).status(200).send({jwt_token})
});

router.get("/authenticate/:id", upload.none(), async function (req, res) {
    
    const isAuthorised = User_functions.authorise(req,res,req.params.id)
    if(!isAuthorised){
        return res.status(403).json({error:"You are not authorised !!"})
    }
    return res.status(200).json({success:"You are logged in."})
});




const generateJWTToken = (userData) =>{
    return jwt.sign(userData, process.env.SECRET_KEY,{ expiresIn: '1h' });
 }

// const requiresLogin = (req, res, next) => {
//     console.log("req.session : ",req.session)
//     if ("cookie" in req.) {
//         return next();
//     } else {
//         console.log("User not logged in")
//         return res.status(401).json({error:'You must be logged in to view this page.'})
//     }
// }

router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.json({msg:"Successfully logged out"});
            }
        });
    }
});


router.post('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.json({msg:"Successfully logged out"});
            }
        });
    }
});
module.exports = router;