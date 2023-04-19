const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const nodemailer = require('nodemailer');
const path = require("path");
require('dotenv').config();

const ejs = require("ejs");
const expressLayouts = require('express-ejs-layouts');
const mainRoute = require("./routes/MainRoute.js");
const userRoute = require("./routes/UserRoute.js");
const marksismRouter = require("./routes/ideologyRoutes/marksismRoutes.js")
const UserModel = require("./models/User.js")
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });
// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// Set the path to your views folder
app.set('views', path.join(__dirname, 'views'));


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/vendor')));

// Set up routes
app.use('/', mainRoute );
app.use('/user', userRoute);
app.use('/marksism', marksismRouter);

// Start server
app.listen(process.env.PORT, () => {
  console.log('Server started on port 3000');
});
module.exports.upload = upload