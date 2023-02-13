module.exports.isJsonString= (str)=> {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
// doesnt work with nested objects
module.exports.Check_Structure=(obj,attrs)=>{

    for(i=0; i<attrs.length; ++i) {
        if(obj[attrs[i]] == undefined)
            return false;
    }
   
    return (Object.keys(obj).length===attrs.length)? true:false;
}