
const express = require('express');
const api = express.Router();
const User = require('../connections/Users');
const authController = require('../connections/authentication')

api.get('/user', (req, res) => authController());
api.get('/user/:token', authController.activateHandle)
api.post('/user', (req, res) => authController.registerHandle);



module.exports = api;