const UserModel=require('../models/user.model');
const createError = require('http-errors');
const ticketModel=require('../models/ticket.model');
//create user: signup callback
const createUser=async(req,res,next)=>{
    const email=req.body.email;
    try {
        const isPresentUser=await UserModel.findOne({email});
        if(isPresentUser) return res.json({user:isPresentUser,isPresent:true});
        const user=await UserModel.create({...req.body});
        return res.json({user});
    } catch (error) {
        next(error);
    }
}
//log in
const loginUser=async(req,res,next)=>{
    const email=req.body.email;
    try {
        const isPresentUser=await UserModel.findOne({email});
        if(isPresentUser) return res.json({user:isPresentUser,isPresent:true});
        else throw(createError.NotFound);
    } catch (error) {
        next(error);
    }
}

//get user tickets
const getUserTickets=async(req,res,next)=>{
    const {uid}=req.params;
    const {status}=req.query;
    
    try {
        const isPresentUser=await UserModel.findById(uid);
        if(!isPresentUser) throw(createError.NotFound);

        const tickets=await ticketModel.find({[creator.id]:uid,isDeleted:false});

        if(status){
            //filter by status;
            let splitVals={'Pending':[],'In Progress':[],"Completed":[]}
            statusVals=["Pending","In Progress","Completed"];
            tickets.forEach((ticket)=>{
                switch(ticket.status){
                    case "Pending":splitVals['Pending']=[ticket,...splitVals['Pending']];break;
                    case "In Progress":splitVals['In Progress']=[ticket,...splitVals['In Progress']];break;
                    case "Completed":splitVals['Completed']=[ticket,...splitVals['Completed']];break;
                }
            })
            return res.json({splitVals});
        }

        
            return res.json({tickets})
        
    } catch (error) {
        next(error);
    }   
}


//get user rooms
const getUserRooms=async(req,res,next)=>{
    const {id}=req.params;
    try {
        const user=await UserModel.findById(id);
        if(!user) throw(createError.NotFound);
        return res.json({rooms:user.rooms});
    } catch (error) {
        next(error);
    }
}

const getUser=async(req,res,next)=>{
    const {id}=req.params;
    try {
        const user=await UserModel.findById(id);
        if(!user) throw(createError.NotFound);
        return res.json({user});
    } catch (error) {
        next(error);
    }
}



module.exports={
    getUser,
    getUserRooms,
    getUserTickets,
    loginUser,
    getUserRooms,
    createUser
}
