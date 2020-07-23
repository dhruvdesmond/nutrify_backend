var express = require("express");
const multer = require('multer');
const upload = multer();
var router = express.Router();
const Meal = require('../models/meal');
const User = require('../models/user');
const Meal_functions = require('../controller/meal_controller');
const User_functions = require('../controller/user_controller');


router.get("/meals/user/:id", function (req, res) {
    Meal.findAll({
        where: {
            user_id: req.params.id
        }
        })
        .then(meals => {
            console.log(meals.length)
            res.json(meals)
        })
        .catch(err => {
            res.json({error:err})
        })
});


router.get("/meals", function (req, res) {
    
    Meal.findAll()
        .then(meals => {
            res.json(meals)
        })
        .catch(err => {
            res.json({error:err})
        })
});

router.post("/meals", upload.none(),User_functions.requiresLogin, async function (req, res) {
    const food_name = req.body.food_name
    const curr_calories = req.body.calories
    console.log("Meal details =  = ",food_name,curr_calories)
    User_functions.getUserIdFromJWT(req,res)
    .then(user_id=>{
        User_functions.checkUserExists(user_id)
        .then(user=>{
            if (user === -1) {
                return res.json({error:"No such user"})
            }
            Meal_functions.createMeal(food_name, curr_calories, user_id)
            .then(newMeal=>{
                return res.json(newMeal)
            })
            .catch(err=>{
                return res.json({error:err})
            })
        })
        .catch(err=>{
            return res.json({error:err})
        })
    })
    .catch(err=>{
        return res.json({error:err})
    })
    

});
router.get("/meals/:id", function (req, res) {
    Meal_functions.getMealById(req.params.id)
        .then(meal => {
            return res.json(meal)
        })
        .catch(err => {
            return res.json(err)
        })
});
router.put("/meals/:id", upload.none(),async function (req, res) {
    const meal_id = req.params.id
    const curr_name = req.body.food_name
    const curr_calories = req.body.calories
    await Meal_functions.updateMeal(meal_id,curr_name,curr_calories)
    User_functions.getUserIdFromJWT(req,res)
    .then((user_id)=>{
        User_functions.updateUserCalories(user_id)
        
    })
    const meal = await Meal_functions.getMealById(meal_id)
    return res.json(meal)

});



router.delete("/meals/:id", function (req, res) {
    const meal_id = req.params.id
    Meal.destroy({
            where: {
                meal_id: meal_id
            }
        })
        .then(() => {
            
            return res.status(200).json({success:"Meal deleted"})
        })
        .catch(err => {
            return res.json({error:err})
        })
});




module.exports = router;