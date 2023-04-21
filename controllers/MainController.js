exports.Index = (req, res) => {
    res.render('Home/index',{
        "title" : "TİTLE",
        layout:'layout',
        
    })
};

exports.Privacy = (req, res) => {
    res.render('Home/privacy',{
        "title" : "PRİVACY",
        layout:'layout'
    })
};
exports.About = (req, res) => {
    res.render('Home/About',{
        "title" : "About this forum",
        layout:'layout'
    })
};

const User = require("../models/User");