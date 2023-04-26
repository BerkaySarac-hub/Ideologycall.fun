const mongoose = require('mongoose');
//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/Ideologycall';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology:true});
 //Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
  Nickname: {
    type: String,
    
    required: true
  },
  Email: {
    type: String,
    required: true,
  },
  Ideology: String,
  Password: {
    type: String,
    minLength: 8,
    maxLength: 80,
    required: true
  },
  ProfilePicture: Buffer,
  MemberDate: {
    type : Date,
    default: () => new Date(),
    required:true
  },
  IsDelegate: {
    type: Boolean,
    default: false
  },
  IsStuff: {
    type: Boolean,
    default: false
  },
  IsBanned: {
    type: Boolean,
    default: false
  },
  Rank: {
    type: String,
    default: "Newbie"
  },
  EntryCount: {
    type: Number,
    default: 0
  },
});
const User = db.model("User",userSchema)
db.once('open',()=>{
  console.log("Connected to Mongodb");
});
const create = (user) => {
  return User.create(user)
    .then(user => {
      console.log('User created successfully!' + user);
      return user;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getUserIdByEmail = async (email) => {
  try {
    const user = await User.findOne({ Email: email }).exec();
    if (!user) {
      return;
    }
    return user._id;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getAllUsers = () => {
  return User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      console.log(users);
      return users;
    }
  });
};
const getUserByEmail = (email) => {
  return User.find({ Email: email })
    .then((users) => {
      console.log("getUserByEmail Çalıştı sonuç ==== "+users);
      return users;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getUserByEmailAndNickname = (email, nickname) => {
  return User.find({ Email: email, Nickname: nickname })
    .then((users) => {
      
      return users;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getPasswordByEmail = (email) => {
  return User.findOne({ Email: email }, { Password: 1 })
    .then((user) => {
      console.log(user.Password);
      return user.Password;
    })
    .catch((err) => {
      console.log(err);
    });
}
const getNicknameByEmail = (email) => {
  return User.findOne({ Email: email }, { Nickname: 1 })
    .then((user) => {
      console.log(user.Nickname);
      return user.Nickname;
    })
    .catch((err) => {
      console.log(err);
    });
}
const getIdeologyByEmail = (email) => {
  return User.findOne({ Email: email }, { Ideology: 1 })
    .then((user) => {
      console.log(user.Ideology);
      return user.Ideology;
    })
    .catch((err) => {
      console.log(err);
    });
};


const getUserById = async (Id) => {
  try {
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(Id) });
    console.log(user);
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const update = async (Id,Email,Nickname , Password,profilePicture) => {
  User.findOneAndUpdate({ _id: Id }, { Email,Email,Nickname:Nickname , Password:Password ,ProfilePicture:profilePicture}, { new: true })
  .then(updatedUser => {
    console.log(updatedUser);
  })
  .catch(error => {
    console.error(error);
  });
}

module.exports = {
  getAllUsers,
  getUserByEmail,
  getIdeologyByEmail,
  getUserById,
  create,
  getUserIdByEmail,
  getPasswordByEmail,
  getNicknameByEmail,
  update,
  getUserByEmailAndNickname
};
/**
 * ProfilePicture: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
 */