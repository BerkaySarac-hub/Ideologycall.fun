const mongoose = require('mongoose');
//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/Ideologycall';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology:true});
 //Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const EmailSchema = new mongoose.Schema({
    From : {
        type:String,
        required:true
    },
    to : {
        type:String,
        required:true
    },
    header : {
        type:String,
        required : true
    },
    Description : {
        type:String,
        required:true
    },
    SendDate: {
        type: Date,
        default: () => new Date(),
      },
    ExpireDate: {
        type: Date,
        default: () => {
          const date = new Date();
          date.setDate(date.getDate() + 7); // 1 hafta sonrası için 7 gün eklenir
          return date;
        },
    },
     
});