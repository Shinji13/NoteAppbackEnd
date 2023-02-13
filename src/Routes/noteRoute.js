const url=require("url")
const noteModel=require("../schemas/NoteSchema")
const {InvalidDbRes,badRequest}=require("../utiltyFuncions/ErrorResponses")
const {isJsonString,Check_Structure}=require("../utiltyFuncions/Json")


function NoteHandler(req,res){
    let body=""
    req.on("data",(data)=>{
           body+=data.toString();
    })
    req.on("end",()=>{
         body=isJsonString(body)? body:"{}"
         body=JSON.parse(body)   
         if(req.method == "GET")
            getNoteContent(res,req)
         else if(req.method == "POST")
            createNote(res,body)
         else if(req.method == "PUT")
            updateNote(res,body)
         else if(req.method == "DELETE")
            deleteNote(res,req) 
    })
}


function getNoteContent(res,req){
    const {query}=url.parse(req.url,true)
    if(query.id){
           noteModel.findOne({id:query.id},{"content":1,"_id":0}).then((content)=>{
           res.writeHead(200,{"content-type":"application/json"})
           res.end(JSON.stringify(content))
           }).catch(()=>{
            InvalidDbRes(res)
         })
    } else{
           badRequest(res)
    }
}
function createNote(res,body){
    if(Check_Structure(body,["id","content","title","tags"])){
         noteModel.create(body).then(()=>{
         res.writeHead(200,{"content-type":"plain/text"})
         res.end(`Creation of note with id ${body.id} done successfully`)
       }).catch(()=>{
           InvalidDbRes(res)
       })
    } else {
           badRequest(res) 
    }
}

function updateNote(res,body){
    if(Check_Structure(body,["id","content","title","tags"])){
         noteModel.updateOne({id:body.id},{$set:body}).then(()=>{
         res.writeHead(200,{"content-type":"plain/text"})
         res.end(`updating the note with id ${body.id} done successfully`)
      }).catch(()=>{
         InvalidDbRes(res)
      })
    } else{
         badRequest(res)
    }
}
function deleteNote(res,req){
   const {query}=url.parse(req.url,true)
   if(query.id){
         noteModel.deleteOne({id:query.id}).then(()=>{
         res.writeHead(200,{"content-type":"plain/text"})
         res.end(`deleting the tag with id ${query.id} done successfully`)
      }).catch(()=>{
         InvalidDbRes(res)
      })
   } else{
         badRequest(res)
    }
}

module.exports=NoteHandler