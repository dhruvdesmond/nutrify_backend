var session = require('express-session')

app.use(session({ secret: 'keyboard cat', resave:false,saveUninitialized:false,cookie:{ maxAge: 60000 }}))


