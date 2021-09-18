
const express = require('express');
const authController = require('../connections/authentication');
const router =  express.Router();
const { ensureAuthenticated } = require('../config/cheakAuth');

router.get("/", (req, res) => {
    res.render("login");
});

router.get('/signup', (req, res) => {
    res.render("signup");
});

router.get('/home', ensureAuthenticated,(req, res) => {
    res.render("home");
})

router.post('/login', authController.loginHandle);

module.exports = router;