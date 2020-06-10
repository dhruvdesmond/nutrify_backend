import React  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory ,
    withRouter 
    
  } from "react-router-dom";

const jwt = require('jsonwebtoken');


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password:'',
            redirect: false};
    
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        
        this.handleSubmit = this.handleSubmit.bind(this);
      
    }

    handleUsernameChange(event) {

        this.setState({username: event.target.value});
    }
    handlePasswordChange(event) {

        this.setState({password: event.target.value});
    }
    handleSubmit(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.state.username,password : this.state.password })
        };
        let first = process.env.REACT_APP_URL
        let second_arg = "login"
        let url = first + second_arg
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if('error' in data){
                alert("Failed");
            }
            else{
                // let history = useHistory();
                const token = data['jwt_token']
                const decoded = jwt.decode(token);
                const current_user_id = decoded['user_id']
                // this.history.push("/dashboard");
                localStorage.setItem('auth_token',token);
                localStorage.setItem('user_id',current_user_id);
                this.props.history.push('/dashboard');
                
            }
        })
    }
    
    render() {

        return (
          <form className="form-control " style={{height:"auto",margin:"15px"}} onSubmit={this.handleSubmit}>
         
           
              <input className="form-control login-signup"type="text" name="username" placeholder="Enter your Email" value={this.state.username }  onChange={this.handleUsernameChange}  />
         
              <input className="form-control login-signup" type="text" name="password" placeholder="Enter your password" value={this.state.password }  onChange={this.handlePasswordChange}  />
           

            <input className="form-control login-signup  btn-primary" type="submit" value="Submit" />
          </form>
        );
      } 
}

export default (withRouter)(LoginForm);
// export default LoginForm;

