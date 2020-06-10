import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

class AddMeal extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            foodname: '',
            cals:0,
            total_calories:0};
        
        this.handleFoodnameChange = this.handleFoodnameChange.bind(this);
        this.handleCaloriesChange = this.handleCaloriesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleFoodnameChange(event) {

        this.setState({foodname: event.target.value});
    }
    handleCaloriesChange(event) {

        this.setState({cals: event.target.value});
    }

    handleSubmit(event) {
        
        event.preventDefault();
        const token = localStorage.getItem("auth_token")
        const requestOptions = {
            
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        'auth_token' :token },
            body: JSON.stringify({  food_name: this.state.foodname,
                                    calories : this.state.cals ,
                                    
                                })  
        };
        let first = process.env.REACT_APP_URL
        let second_arg = "meals/"
        let url = first + second_arg
        console.log(requestOptions)
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if('error' in data){
                console.log(data)
                alert(data['error']);
            }
            
        })
        this.props.hideandshow();
    }
    
    render() {

        return (
            
          <form className="form-control" onSubmit={this.handleSubmit} style={{height:"100%"}}>

              <input className="form-control" type="text" placeholder="Enter your food name" name="food_name" value={this.state.foodname }  onChange={this.handleFoodnameChange}  />

              <input className="form-control"type="text"placeholder="Enter calories if u know"name="calories" value={this.state.cals }  onChange={this.handleCaloriesChange}  />

            <input className="form-control   btn-primary "type="submit" value="Submit" />
          </form>
        );
      } 
}


export default (withRouter)(AddMeal);