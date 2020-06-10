import React from 'react';


import ReactDOM from 'react-dom';
import './index.css';
import RegisterForm from './registerForm';
import LoginForm from './loginForm';
import AllUsers from './allUsers';
import UserCard from './userCard';
import AddMeal from './addmeal';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory ,
    useParams
  } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { isLogin } from "./utils/auth.js"

const jwt = require('jsonwebtoken');




class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }
    componentDidMount(){
        const decoded = jwt.decode(localStorage.getItem('auth_token'));
        const current_user_id = decoded['user_id']
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                    'auth_token' :decoded},
            body: JSON.stringify()
        };
        let url = process.env.REACT_APP_URL + "authenticate/" + current_user_id
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if('error' in data){
                
                this.setState({
                    isLoggedIn:false
                });
            }
            else{
                
                this.setState({
                    isLoggedIn:true
                });
            }
        })
    }

	render() {

        
        
	    return (
        <Router>
            <div>
            <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/dashboard">Nutrify</a>
                

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link " href="/users/meals">Profile</a>
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0">
                        {!this.state.isLoggedIn ? <LoginKit /> : <LogoutKit />}
                        
                        
                    </form>
                </div>
                </nav>
            </div>
        
            <div className="container">
                <div className="row ">
                    
                    <div className="col "><button className="form-control btn btn-outline-primary"   ><Link to="/signup">Signup</Link></button></div>
                    <div className="col"><button className="form-control btn btn-outline-primary"> <Link  to="/login">Login</Link></button></div>
                </div>
                <div className="row ">
                    <Switch>
                                <Route path="/login">
                                    <LoginForm />
                                </Route>
                                
                            
                                <Route path="/signup">
                                    <RegisterForm/>
                                </Route>
                        
                            <Route path="/dashboard" component = {AllUsers} />

                            <Route path="/users/:user_id" component = {UserCard} />
                            <Route path="/meals/add" component = {AddMeal} />
                        
                    </Switch>
                </div>
            </div >


            
        
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        
      </div>
    </Router>
	  );
	}
  }
  

function LoginKit(props) {
    return( <div>
                <button className="form-control btn btn-outline-primary"   ><Link to="/signup">Signup</Link></button>
                <button className="form-control btn btn-outline-primary"> <Link  to="/login">Login</Link></button>
                
            </div>) ;
}   

function LogoutKit(props) {
    return( <div>
                <button className="form-control btn btn-outline-primary"> <Link  to="/logout">LogOut</Link></button>
                
            </div>) ;
}   


class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }
	render() {
	    return (
            <div>
                <div >
                    <h5> Yo yo</h5>
                </div>
            </div>
	  );
	}
  }
  

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }
	render() {
	    return (

            <div>
                <div >
                    <HomePage/>
                </div>
            </div>
	  );
	}
  }
  
  // ========================================
  
ReactDOM.render(
	<Game />,
	document.getElementById('root')
  );
