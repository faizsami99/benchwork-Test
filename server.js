
const express = require('express');
const http = require('http');
const path = require('path');
const router = require('./router/router');
const api = require('./api/api');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);
require('./connections/connection');
require('dotenv').config();

const PORT = process.env.PORT || 3000; 

const app = express();

const server = http.createServer(app);

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/', router);
app.use('/api', api);

server.listen(PORT, ()=>{
    console.log("http://localhost:3000"); 
});


