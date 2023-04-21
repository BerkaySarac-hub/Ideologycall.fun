const express = require('express');
const router = express.Router();
const mainController = require('../controllers/MainController');
const authMiddleware = require("../middlewares/authMiddleware");

// GET /users route
router.get('/', mainController.Index);
router.get('/privacy', mainController.Privacy);
router.get('/about', mainController.About);

module.exports = router;