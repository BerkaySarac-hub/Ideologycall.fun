const express = require('express');
const router = express.Router();
const mainController = require('../controllers/MainController');

// GET /users route
router.get('/', mainController.Index);
router.get('/privacy', mainController.Privacy);
router.get('/about', mainController.About);
router.get("/pp",mainController.pp);
router.get("/getAllUsers",mainController.getAllUsers);
module.exports = router;