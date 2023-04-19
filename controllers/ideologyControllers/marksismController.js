exports.homeGet = (req,res)=>{
    res.render("Ideologies/marksism/home",{
        IdeologicTitle:"Marksism",
        layout:"Ideologies/IdeologyLayout"
    })
}