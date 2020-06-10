
const jwt = require('jsonwebtoken');

export const isLogin = () => {
    
    
    if (localStorage.getItem('auth_token')) {
        return true
    }
    else
    {
        console.log(3)
        return false;
    }
}