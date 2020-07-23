import React, { useState, useEffect } from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Redirect } from "react-router-dom";
import dotenv from "dotenv";

const NewRegisterForm = (props) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [total_calories, SetTotalCalories] = useState(undefined);
    const [total_calories_string, SetTotalCaloriesString] = useState("");
    // const [redirect, setRedirect] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
                name: userName,
                total_calories: total_calories,
            }),
        };
        let first = process.env.REACT_APP_URL;
        let second_arg = "users";
        let url = first + second_arg;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if ("error" in data) {
                    console.log(data);
                    alert(data["error"]);
                } else {
                    props.toggleSignUp();
                }
            });
    };
    useEffect(() => {
        if (total_calories_string !== "") {
            SetTotalCalories(SetTotalCaloriesString);
        }
    }, [total_calories_string]);
    return (
        <form
            className="form-control"
            style={{ height: "auto", margin: "15px" }}
            onSubmit={handleSubmit}
        >
            <input
                className="form-control login-signup"
                type="text"
                placeholder="Enter your user name"
                name="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />

            <input
                className="form-control login-signup"
                type="text"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="form-control login-signup"
                type="text"
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                className="form-control login-signup"
                type="number"
                name="totalCalories"
                placeholder="Enter your total calories"
                value={total_calories}
                onChange={(e) => SetTotalCalories(e.target.value)}
            />
            <input
                className="form-control   btn-primary login-signup"
                type="submit"
                value="Submit"
            />
        </form>
    );
};

export default NewRegisterForm;
