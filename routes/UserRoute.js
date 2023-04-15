// routes/users.js
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

const express = require('express');
const router = express.Router();
const path = require("path");
const userModel = require("../models/User")
const userController = require('../controllers/userController');

// GET /users route
router.get('/register', userController.RegisterGet);
router.post('/register', upload.single('profilePicture'), userController.Register);
router.get('/login', userController.loginGet);
router.post('/login', userController.login);
module.exports = router;