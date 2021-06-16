const mongoose = require("mongoose");


const dbConnection = async() =>{

    try{
        mongoose.connect(process.env.dbConnection,{
    useNewUrlParser: true, //
    useUnifiedTopology: true, //mongo can use mongo commands
    useFindAndModify: false, //doesn't send information by console
    useCreateIndex: true, //let createdb     from index
        })
        console.log("MongoDB Connection")
    }catch(error){
        console.log("Error Connection with MongoDB")
    }

}


module.exports = {dbConnection}