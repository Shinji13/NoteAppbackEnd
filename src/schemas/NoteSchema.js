const mongoose=require("mongoose");

const noteSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
        immutable:true,
    },
    title:{
        type:String,
        required:true,
        default:()=>{return `title number ${Math.random()}`}
    },
    content:{
        type:String,
        required:true,
    },
    tags:{
        type:[String],
        required:true,
        alias:"ListOfTagIds"
    },
},{collection:"NoteStore"})

module.exports=mongoose.model("NoteStore",noteSchema) 