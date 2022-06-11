const msgModel=require('../models/msg.model');
const createError = require('http-errors');

// send message
const sendMessage=async(req,res,next)=>{
    const {roomId}=req.params;
    //req.body==>{from, to, content, isTemplate}
    try {
        const msg=await msgModel.create({roomId,...req.body});
        if(!msg) throw(createError(500,`Insufficient info`));
        console.log(msg);
        return res.json({msg});
    } catch (error) {
        next(error);
    }
}
// get message: convid
const getMessage=async(req,res,next)=>{
    const {roomId}=req.params;

    try {
        const msgs=await msgModel.find({roomId});
        return res.json({msgs});
    } catch (error) {
        next(error);
    }
}

module.exports={sendMessage,getMessage};