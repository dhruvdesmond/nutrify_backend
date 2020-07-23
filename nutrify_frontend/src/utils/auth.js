const jwt = require("jsonwebtoken");

export const isLoggedIn = () => {
    // console.log(localStorage.getItem("auth_token"));
    if (!localStorage.getItem("auth_token")) {
        logOut();
        return false;
    }
    // console.log(localStorage.getItem("loginTime"));
    var d = new Date();
    // console.log("Expire ", Date.now() + 1 * 1000);
    // console.log("Allowed time", localStorage.getItem("loginTime"));
    const time1 = Date.now();
    const time2 = localStorage.getItem("loginTime");
    var diffDays = (time1 - time2) / (1 * 60 * 60 * 1000);

    var date = new Date(time1);
    var date2 = new Date(parseInt(time2) + 1 * 60 * 60 * 1000);




    if (localStorage.getItem("auth_token") && date < date2) {
        console.log("Logged In");
        return true;
    } else {
        console.log("Logged Out");
        logOut();
        return false;
    }
};

export const logOut = () => {
    
    let first = process.env.REACT_APP_URL;
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
    };
    let second_arg = "logout";
    let url = first + second_arg;

    fetch(url, requestOptions);
    localStorage.clear();
};
