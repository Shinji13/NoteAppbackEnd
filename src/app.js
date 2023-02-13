const http=require("http")
const fs=require("fs");
const url=require("url")
const mongoose=require("mongoose");
const tagModel=require("./schemas/TagSchema")
const noteModel=require("./schemas/NoteSchema")
const NoteHandler=require("./Routes/noteRoute");
const TagHandler=require("./Routes/tagRoute");
const {InvalidDbRes}=require("./utiltyFuncions/ErrorResponses");


//strictQuery is deprecated
mongoose.set('strictQuery', false);

//Global variables
let MAX_NUM_RECONNECTS=0
let DatbaseConnection=false

mongoose.connect("mongodb://127.0.0.1:27017/NoteApp",onConnection)

const app=http.createServer((req, res) => {
    if(DatbaseConnection){
       HandleServerRequests(req,res)
    } else {
       DatabaseDisconnectedRes(res)
    }
})
app.listen(8000,"localhost",()=>{
  fs.writeFileSync("Files/ServerLogs.txt",`Server is listening on localhost:8000 at ${new Date().toString()} \n`,{flag:"a"})
})

async function HandleServerRequests(req,res){
    
    const {pathname}=url.parse(req.url)
        if(pathname==="/note"){
             NoteHandler(req,res)
        } else if(pathname==="/tag"){
             TagHandler(req,res)
        } else if(pathname==="/notes"){
             Promise.all([
               noteModel.find({},{"_id":0,"content":0,"__v":0}),
               tagModel.find({},{"_id":0,"__v":0})
             ]).then((data)=>{
                let [notes,tags]=data
                let resJson={notes,tags}
                res.writeHead(200,{"content-type": "application/json"})
                res.end(JSON.stringify(resJson))
             }).catch((err)=>{
                  InvalidDbRes(res)
             })
            }
         
}
function DatabaseDisconnectedRes(res){
     res.writeHead(503,{"content-type": "text/plain"})
     res.end("the database service does not respond for now, try reconnecting later")
}

function onConnection(error){
    if(!error){
       DatbaseConnection=true
    } else if(MAX_NUM_RECONNECTS<3){
        mongoose.connect("mongodb://127.0.0.1:27017/NoteApp",onConnection)
    } else{
        fs.writeFileSync("Files/ServerLogs.txt",`The connection process to note_app database has failed ${new Date().toString()} \n`,{flag:"a"})
    }
    MAX_NUM_RECONNECTS++;
}


