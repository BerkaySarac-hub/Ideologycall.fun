const express = require('express');
const router = express.Router();
const marksismController = require('../../controllers/ideologyControllers/marksismController');
const authMiddleware = require("../../middlewares/authMiddleware");
const ideologyCheck = require("../../middlewares/ideologyMiddleware");

router.get("/home",authMiddleware.AuthenticateToken,marksismController.homeGet);

module.exports = router;