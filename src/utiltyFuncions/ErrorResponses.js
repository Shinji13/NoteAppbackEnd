module.exports.badRequest=(res)=>{
    res.writeHead(400,{"content-type":"plain/text"})
    res.end(`Bad request playload your objects need to respect the schema and the right query string`) 
}
module.exports.InvalidDbRes=(res)=>{
    res.writeHead(502,{"content-type": "plain/text"})
    res.end("Getting invalid response from the database ")
}