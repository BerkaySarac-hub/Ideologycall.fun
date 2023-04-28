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
router.post('/login',authMiddleware.IsHeBanned, userController.login);
router.get('/index',authMiddleware.AuthenticateToken,authMiddleware.IsHeBanned,userController.index);
router.get("/profile",authMiddleware.AuthenticateToken,authMiddleware.IsHeBanned,userController.profileGet);
router.post("/profile",authMiddleware.AuthenticateToken,authMiddleware.IsHeBanned,upload.single('profilePicture'),userController.profilePost);
router.get("/logout",authMiddleware.AuthenticateToken,userController.logout);
router.get("/notifications",authMiddleware.AuthenticateToken,userController.getNotifications);
router.post("/notifications",authMiddleware.AuthenticateToken,userController.notificationsPost); //!
router.get("/sendmail",authMiddleware.AuthenticateToken,userController.getSendMail);
router.post("/sendmail",authMiddleware.AuthenticateToken,userController.postSendMail)
module.exports = router;