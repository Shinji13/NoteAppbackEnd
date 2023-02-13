const mongoose=require("mongoose");

const tagSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
},{collection:"TagStore"})

module.exports=mongoose.model("TagStore",tagSchema)