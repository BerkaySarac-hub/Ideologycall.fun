const mongoose = require('mongoose');
//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/ideologycall';
mongoose.connect(mongoDB, { useNewUrlParser: true });
 //Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
  Nickname : String,
  Email : String,
  Ideology : String,
  Password: String,
  ProfilePicture: {
    type: mongoose.BinData,
  },
  MemberDate: Date
});
module.exports = {
  getAllUsers,
  getUserByEmail,
  getIdeologyByEmail,
  getUserById,
  create
};