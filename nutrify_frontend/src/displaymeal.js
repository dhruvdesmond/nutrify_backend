import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isLogin } from "./utils/auth.js"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    withRouter 
  } from "react-router-dom";
  import dotenv from  'dotenv'

class Meal extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            meal:this.props.curr_list.meal,
            displayeditpage : false,
            isdeleted : false
        };
        this.toggleButtonEditMeal = this.toggleButtonEditMeal.bind(this);
        this.changeMealData = this.changeMealData.bind(this);
        this.deletemeal = this.deletemeal.bind(this);

    }

    toggleButtonEditMeal(){
        this.setState((currentState) => ({
            displayeditpage: !currentState.displayeditpage, 
        }));
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    changeMealData(mealId,mealName,MealCals){
        console.log("changeMealData")
        const token = localStorage.getItem("auth_token");
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',
                        'auth_token' :token },
            body: JSON.stringify({  food_name: mealName,
                                    calories : MealCals ,
                                    
                                })  
        };

        
        let first = process.env.REACT_APP_URL
        let second_arg = "meals/" + mealId
        let url = first + second_arg
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if('error' in data){
                console.log(data)
                
            }
            else{
                console.log(data)
                this.setState({meal:data})
                this.toggleButtonEditMeal()
            }
        })
    }

    
    deletemeal(mealId){
        
        const token = localStorage.getItem("auth_token");
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json',
                        'auth_token' :token },
            body: JSON.stringify()  
        };

        let first = process.env.REACT_APP_URL
        let second_arg = "meals/" + mealId
        let url = first + second_arg
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if('error' in data){
                console.log(data)

            }
            else{
                this.setState({isdeleted:true})
            }
        })
    }
    
    
    render() 
        {

        const meal_id = this.state.meal['meal_id']
        const url = this.props.curr_list.url
        const newUrl = url + this.state.meal.meal_id
        if(this.state.isdeleted){
            return null
        }else{
            return (
                <div style={{height:"auto"}}>
    
                    {!this.state.displayeditpage ?  <ShowMealProp meal={this.state.meal} url={url} toggleeditshow = {this.toggleButtonEditMeal} deletemeal= {this.deletemeal}/> :
                                                    <EditMealProp meal={this.state.meal} url={url} toggleeditshow = {this.toggleButtonEditMeal}  changeMealDataprop = {this.changeMealData}/>
                    }
                </div>
                
                ) ;
        }
        
      } 
}




function ShowMealProp(props) {
    const meal = props.meal
    
    console.log(props)
    const meal_id = meal.meal_id
    
    const url = props.url

    return( <div>
                <p>
                    <span style={{display:"block"}}>Food name : <a  href= {url + meal.meal_id} >{meal.food_name} </a></span>
                    <span>Calories : {meal.calories}</span>
                </p>
                <div style={{display: "flex"}}>
                    <button className="form-control btn btn-outline-warning" style={{display: "inline-block"}} onClick={() => props.toggleeditshow()}>
                                    Edit Meal
                    </button>
                    <button className="form-control btn btn-outline-danger" style={{display: "inline-block"}} onClick={() => props.deletemeal(meal_id)}>
                                    Delete
                    </button>
                </div>
                
            </div>) ;
}   





function EditMealProp(props) {
    
    const meal = props.meal


    const [currMealName,newMealName] = useState(props.meal.food_name)

    const [mealCal,newMealCal] = useState(props.meal.calories)

    const handleSubmit = values => {
        values.preventDefault();
    }


    return (<div style={{height:"auto"}}>
                <form className="form-control" onSubmit={handleSubmit} style={{height:"auto"}}>

                <input className="form-control "type="text" placeholder="Enter  Foodname" name="email" value={currMealName }  onChange={e => newMealName(e.target.value)} />

                <input className="form-control "type="number" placeholder="Enter calories" name="password" value={mealCal}  onChange={e => newMealCal(e.target.value)}  />

                <div style={{display: "flex"}}>
                    <button className="form-control btn btn-outline-warning" style={{display: "inline-block"}} onClick={() => props.toggleeditshow()}>
                                    Cancel
                    </button>
                    <button className="form-control btn btn-outline-danger" style={{display: "inline-block"}} onClick={() => props.changeMealDataprop(meal.meal_id,currMealName,mealCal) }>
                                    Edit
                    </button>
                </div>
                </form>
            </div>) ;
}   






export default (withRouter)(Meal);