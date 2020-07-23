import React, { useState, useEffect } from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    BrowserRouter as Router,
    useParams,
    withRouter,
} from "react-router-dom";
import AllMeals from "./listMeals";

const UserCard = (props) => {
    const [user, setUser] = useState({});
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", auth_token: token },
            body: JSON.stringify(),
        };
        const userId = props.match.params["user_id"];

        let first = process.env.REACT_APP_URL;
        const url = first + "users/" + userId;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if ("error" in data) {
                    console.log(data["error"]);
                } else {
                    console.log(data);
                    setUser(data);
                }
            });
    }, []);
    return (
        <div
            className="form-control"
            style={{ height: "auto", padding: "15px", margin: "15px" }}
        >
            <div className=" row" style={{ height: "auto" }}>
                <div className="col-7" style={{ height: "auto" }}>
                    <b>Welcome</b>
                    <ShowUserProp user={user} />
                </div>
                <div className="col-5" style={{ height: "auto" }}>
                    <AllMeals curr_user_id={user.user_id} />
                </div>
            </div>
        </div>
    );
};

const ShowUserProp = (props) => {
    const user = props.user;

    const url = props.url;

    return (
        <div>
            <p>
                <span style={{ display: "block" }}>
                    User name : {user.name}{" "}
                </span>
                <span style={{ display: "block" }}>
                    Current Calories consumed: {user.current_calories}
                </span>
                <span style={{ display: "block" }}>
                    Total Calories Allowed: {user.max_calories}
                </span>

                {user.current_calories >= user.max_calories ? (
                    <span style={{ display: "block" }}>
                        You have exceeded your calorie limit.
                    </span>
                ) : (
                    <span style={{ display: "block" }}>
                        You are lacking behind. You need to eat more.
                    </span>
                )}
            </p>
            <div style={{ display: "flex" }}>
                <button
                    className="form-control btn btn-outline-warning"
                    style={{ display: "inline-block" }}
                >
                    Edit User
                </button>
                <button
                    className="form-control btn btn-outline-danger"
                    style={{ display: "inline-block" }}
                >
                    Delete User
                </button>
            </div>
        </div>
    );
};

export default UserCard;
