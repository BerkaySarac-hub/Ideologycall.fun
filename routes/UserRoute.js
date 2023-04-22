// routes/users.js
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const authMiddleware = require("../middlewares/authMiddleware")
const ideologyCheckMiddleware = require("../middlewares/ideologyMiddleware")
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
router.get('/index',authMiddleware.AuthenticateToken,userController.index);
router.get("/profile",authMiddleware.AuthenticateToken,userController.profileGet);
router.post("/profile",authMiddleware.AuthenticateToken,userController.profilePost);
router.get("/logout",authMiddleware.AuthenticateToken,userController.logout);
module.exports = router;