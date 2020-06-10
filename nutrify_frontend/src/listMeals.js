import React,{ useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";

import dotenv from  'dotenv'
import AddMeal from './addmeal';
import Meal from './displaymeal';
import { isLogin } from "./utils/auth.js"


class AllMeals extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            meals: [],
            curr_user : null,
            mealsdisplay: false,
            addmealdisplay : false
            };
        this.toggleButtonaddmeal = this.toggleButtonaddmeal.bind(this);
    }
    componentWillReceiveProps(props){
        this.setState({curr_user:props.curr_user_id})
        const token = localStorage.getItem("auth_token")
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
            'auth_token' :token
                         },
            body: JSON.stringify()
        };
        let first = process.env.REACT_APP_URL
        let second_arg = "meals/user/" + props.curr_user_id
        let url = first + second_arg
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if('error' in data){
                alert("Failed");
            }
            else{
                this.setState({ meals: data })
            }
        })
    }
    toggleButton(){
        this.setState((currentState) => ({
            mealsdisplay: !currentState.mealsdisplay, 
        }));
    }
    toggleButtonaddmeal(){
        this.setState((currentState) => ({
            addmealdisplay: !currentState.addmealdisplay, 
        }));
    }
    componentDidMount(){
        
        
    }
    
    loadUserDashboard(user_id){
        alert(user_id)
    }
    render() {
        const url = "/meals/"
        let allmeals;
        let addmeals;
        
        
        if(this.state.addmealdisplay){
            addmeals = <AddMeal hideandshow = {this.toggleButtonaddmeal} />
        }
        else{
            addmeals = <div></div>
        }
        return (
            <div className="form-control" style={{height:"auto"}}> 
             <div style={{height:"auto"}}>   
                <button className="form-control btn btn-outline-primary" onClick={() => this.toggleButton()}>
                            Meals
                </button>
                
                    {this.state.mealsdisplay ?  <DisplayAllMeals meals={this.state.meals} url={url} /> :<div style={{height:"auto"}}></div>}
                    
                </div>
                <div style={{height:"auto"}}> 
                <button className="form-control btn btn-outline-primary" onClick={() => this.toggleButtonaddmeal()}>
                            Add meal
                </button>

                    {!this.state.addmealdisplay}
                    {addmeals}
                </div>
                
            </div>
        );
      } 
}






function DisplayAllMeals(props) {
    const meals = props.meals
    const url = props.url

    return (<div style={{height:"auto"}}> 
                {
                    meals.map((meal) =>  <div className="form-control" style={{height:"100%",padding:"10px"}} key={meal.meal_id}>
                        
                        <Meal curr_list={{meal,url}}/>
                    </div>)
                }
            
            </div>
            ) ;
}   


export default AllMeals;
