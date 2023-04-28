const User = require("../models/User");
const passwordService = require('../services/passwordService');
const Email = require("../models/Email")
const { login } = require('../services/passwordService');
const jwt = require("jsonwebtoken");
const emailSender = require("../services/emailSender")
exports.RegisterGet = (req,res) => {
  res.render("User/Register",{
      layout: "layout",
      title : "Register"
  })
}
let today = new Date();
let memberDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

exports.Register = (req, res) => {
  const { nickname, ideology, password } = req.body;
  const hashedPassword = passwordService.hashPassword(password);  
  const profilePicture = `/uploads/${req.file.filename}`;
  if (req.file) {
    const user = {
      Nickname: nickname,
      Email: nickname+"@ideologycall.fun",
      Ideology: ideology,
      Password: hashedPassword,
      MemberDate: memberDate,
      ProfilePicture:profilePicture
    };

    User.create(user)
    .then((user) => {
      console.log(user);
      
      res.redirect("/user/login");
    })
    .catch((err) => {
      console.log(err);
    });
  }else {
    res.send("Please Select Correct Profile Picture Format")
  }
};
exports.loginGet = (req,res)=> {
  res.render("User/login",{
    layout:"layout",
    title:"LOGİN"
  })
}


exports.login = async (req,res)=>{
  const nickname = req.body.Nickname;
  const email = req.body.Email;
  const password = req.body.Password;
  
  User.getUserByEmailAndNickname(email,nickname)
  .then((user)=> {
    if(user.length === 0){
      res.redirect("/user/login");
      return;
    }
    const foundedUser = user[0];
    let passwordResult = passwordService.comparePassword(password,foundedUser.Password);
    if (!passwordResult) {
      res.redirect("/user/login");
      return;
    }
    res.locals.loggedIn = true;
    const token = createToken(foundedUser._id);
    res.cookie("jsonwebtoken",token,{
      httpOnly:true,
      maxAge:1000 * 60 * 24,
    })
    res.redirect(`/${foundedUser.Ideology}/home`)
    
  })
}

exports.index = (req,res)=>{
  res.render("User/index",{
    layout:"layout",
    title : "Index"
  })
}

exports.profileGet = async (req,res) => {
  const token = req.cookies.jsonwebtoken;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const userId = decodedToken.userId;
  const user = await User.getUserById(userId);
  res.render("User/profile",{
    layout:"layout",
    title:"Profile",
    user : user
  })
}
exports.profilePost = async (req,res) => {
  const token = req.cookies.jsonwebtoken;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const profilePicture = `/uploads/${req.file.filename}`;
  const userId = decodedToken.userId;
  const user = await User.getUserById(userId);
  User.update(userId,req.body.Email,req.body.Nickname,passwordService.hashPassword(req.body.Password),profilePicture)
  .then((result)=> {console.log(result); res.redirect("/user/profile")})
  .catch(err => {console.log(err);})
}
exports.logout = (req, res) => {
  // session ve jwt tokeni ile ilgili işlemleri burada yapabilirsiniz
  // örneğin:
  res.clearCookie("jsonwebtoken"); // jwt tokenini sil
  res.redirect("/user/login"); // login sayfasına yönlendir
}

exports.pending = (req,res)=> {
  res.render("User/pending",{
    layout : "layout",
    title : "YOU ARE PENDING"
  })
}
exports.authenticateMailToken = async(req,res)=> {
  try {
    const user = await User.getUserById({_id:req.params.id});
    if (!user) {
      return res.status(400).send("Invalid link");

    }
    const token = process.env.VERIFICATION_TOKEN;
    if (!req.params.token == token) {
      return res.status(400).send("Invalid Link");
    }
    await User.update({_id:user._id,IsBanned:false})
    res.redirect("/user/login")
  } catch (error) {
    
  }
}

exports.getNotifications = async (req, res) => {
  try {
    const token = req.cookies.jsonwebtoken;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId;
    const user = await User.getUserById(userId);
    const mails = await Email.getMail(user["Nickname"]); // değişiklik burada
    res.render("User/notifications", {
      layout: "layout",
      emails: mails,
      title: "notifications"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}


exports.notificationsPost = async (req,res)=> {
  const Nickname = req.body.Nickname;
  const findedMails = Email.getMailByNickname(Nickname);

  return {
    emails:findedMails
  };
}

exports.getSendMail = async(req,res) => {
  res.render("User/sendMail",{
    layout:"layout",
    title:"SEND MAİL"
  })
}
exports.postSendMail = async (req,res)=>{
  try {
    const token = req.cookies.jsonwebtoken;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId;
    const user = await User.getUserById(userId);
    
    const email = {
      from: user["Nickname"],
      to: req.body.To,
      header: req.body.Header,
      description: req.body.Description
    };
    
    const result = await Email.sendMail(email);
    
    console.log(result);
    
    res.redirect("/user/notifications");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while sending email");
  }
}

const createToken = (userId)=>{
  return jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"1d",
  })
};