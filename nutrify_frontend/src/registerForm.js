import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './loginForm';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory 
  } from "react-router-dom";
  import dotenv from  'dotenv'

class RegisterForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password:'',
            email: '',
            total_calories:0,
            redirect: false};
    
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleTotalCaloriesChange = this.handleTotalCaloriesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event) {

        this.setState({username: event.target.value});
    }
    handlePasswordChange(event) {

        this.setState({password: event.target.value});
    }
    handleTotalCaloriesChange(event) {

        this.setState({total_calories: event.target.value});
    }
    handleEmailChange(event) {

        this.setState({email: event.target.value});
    }
    handleSubmit(event) {
        
        event.preventDefault();
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  email: this.state.email,
                                    password : this.state.password ,
                                    name : this.state.username,
                                    total_calories : this.state.total_calories
                                })  
        };
        let first = process.env.REACT_APP_URL
        let second_arg = "users"
        let url = first + second_arg
        console.log(url)
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if('error' in data){
                console.log(data)
                alert(data['error']);
            }
            else{
                this.setState({ redirect: true })
            }
        })
    }
    
    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to='/login'/>;
        }
        return (
            
          <form className="form-control" onSubmit={this.handleSubmit}>

              <input className="form-control login-signup" type="text" placeholder="Enter your user name" name="username" value={this.state.username }  onChange={this.handleUsernameChange}  />

              <input className="form-control login-signup"type="text"placeholder="Enter your email"name="email" value={this.state.email }  onChange={this.handleEmailChange}  />

              <input className="form-control login-signup"type="text" placeholder="Enter your password"name="password" value={this.state.password }  onChange={this.handlePasswordChange}  />

              <input className="form-control login-signup"type="text" name="totalCalories" placeholder="Enter your total calories" value={this.state.total_calories }  onChange={this.handleTotalCaloriesChange}  />
            <input className="form-control   btn-primary login-signup"type="submit" value="Submit" />
          </form>
        );
      } 
}


export default RegisterForm; 