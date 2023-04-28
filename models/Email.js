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
    from : {
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
    description : {
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

const Email = db.model("Email",EmailSchema)
db.once('open',()=>{
  console.log("Connected to Mongodb");
});

const sendMail = (email)=> {
    return Email.create(email)
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
}


const deleteMail = (Id) => {
    Email.deleteOne({_id : Id}).then((result) => {console.log("mail deleted :" + result);})
    .catch((err)=>{console.log(err);})
}
const getMail = async (Nickname) => {
    const results = await Email.find({ to: Nickname });
    if (results.length === 0) {
      return [];
    }
    return results;
};
const getMailByNickname = async(Nickname) => {
    const NicknameResults = await Email.find({From:Nickname});
    if (NicknameResults.length === 0) {
        return;
    }
    return NicknameResults;
}
module.exports = {
    sendMail,
    deleteMail,
    getMail,
    getMailByNickname
}