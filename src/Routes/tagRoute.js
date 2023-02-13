const url=require("url")
const tagModel=require("../schemas/TagSchema");
const {InvalidDbRes,badRequest}=require("../utiltyFuncions/ErrorResponses")
const {isJsonString,Check_Structure}=require("../utiltyFuncions/Json")

function TagHandler(req,res){  
      let body=""
      req.on("data",(data)=>{
             body+=data.toString();
      })
      req.on("end",()=>{
           body=isJsonString(body)? body:"{}"
           body=JSON.parse(body||"{}")   
           if(req.method == "POST")
              createTag(res,body)
           else if(req.method == "PUT")
              updateTag(res,body)
           else if(req.method == "DELETE")
              deleteTag(res,req) 
      })
}
function createTag(res,body){
   if(Check_Structure(body,["id","name"])){         
        tagModel.create(body).then(()=>{
           res.writeHead(200,{"content-type":"plain/text"})
           res.end(`Creation of tag with id ${body.id} done successfully`)
     }).catch(()=>{
          InvalidDbRes(res)
     })
   } else{
          badRequest(res)
   }     
}
function updateTag(res,body){
       if(Check_Structure(body,["id","name"])){         
          tagModel.updateOne({id:body.id},{$set:body}).then(()=>{
            res.writeHead(200,{"content-type":"plain/text"})
            res.end(`updating the tag with id ${body.id} done successfully`)
         }).catch(()=>{
              InvalidDbRes(res)
         })
       } else{
              badRequest(res)
       }
} 
function deleteTag(res,req){
     const {query}=url.parse(req.url,true)
     if(query.id){
         tagModel.deleteOne({id:query.id}).then(()=>{
         res.writeHead(200,{"content-type":"plain/text"})
         res.end(`deleting the tag with id ${query.id} done successfully`)
     }).catch(()=>{
         InvalidDbRes(res)
     })
   } else{
         badRequest(res)
   }
}

module.exports=TagHandler