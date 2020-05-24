var express = require("express");
const multer = require('multer');
const upload = multer();
var router = express.Router();
const Meal = require('../models/meal');
const User = require('../models/user');
const Meal_functions = require('../controller/meal_controller');
const User_functions = require('../controller/user_controller');





router.get("/meals", function (req, res) {
    Meal.findAll()
        .then(meals => {
            res.send(meals)
        })
        .catch(err => {
            res.send(err)
        })
});

router.post("/meals", upload.none(), async function (req, res) {
    const food_name = req.body.food_name
    const curr_calories = req.body.calories
    const user_id = req.body.user_id
    try {

        await User_functions.checkUserExists(user_id)

        if (user === -1) {
            return res.send("No such user")
        }
        await Meal_functions.createMeal(food_name, curr_calories, user_id)

        return res.redirect('/meals')
    } catch (e) {
        return res.redirect(e)
    }

});
router.get("/meals/:id", function (req, res) {
    Meal_functions.getMealById(req.params.id)
        .then(user => {
            return res.send(user)
        })
        .catch(err => {
            return res.send(err)
        })
});
router.put("/meals/:id", upload.none(),async function (req, res) {
    const meal_id = req.params.id
    const curr_name = req.body.food_name
    const curr_calories = req.body.calories
    await Meal_functions.updateMeal(meal_id,curr_name,curr_calories)
    .then(res=>{
        res.send(res)
    })
    .catch(err=>{
        res.send(err)
    })
});



router.delete("/meals/:id", function (req, res) {
    const meal_id = req.params.id
    Meal.destroy({
            where: {
                meal_id: meal_id
            }
        })
        .then(() => {
            return res.redirect("/meals")
        })
        .catch(err => {
            return res.send(err)
        })
});




module.exports = router;