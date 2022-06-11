const e = require('express');
const createError = require('http-errors');
const ticketModel=require('../models/ticket.model');

//create Ticket
const createTicket=async(req,res,next)=>{
    const {uid}=req.params;//user id
    
    try {
        const ticket=await ticketModel.create(req.body);
        //update user stack of tickets or don't

        if(!ticket){
            throw(createError.NotAcceptable);
        }
        return res.json({data:ticket});
    } catch (error) {
        next(error);
    }
}
//get tickets

const getTickets=async(req,res,next)=>{
    const {uid}=req.params;//user id
    const {status}=req.query;

    try {
        
         const tickets=await ticketModel.find({recvId:uid,isDeleted:false});
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

//get 1 ticket 
const getOneTicket=async(req,res,next)=>{
    const {id}=req.params;
    try {
        const ticket=await ticketModel.findById(id);
        return res.json({ticket});
    } catch (error) {
        next(error);
    }
}

//update ticket: status
const updateStatus=async(req,res,next)=>{
    const {id}=req.params;
    const {status}=req.body;
    try {
        const updatedTicket=await ticketModel.findByIdAndUpdate(id,{status},{new:true});
        return res.json({updatedTicket});
    } catch (error) {
        next(error);
    }
}
//update ticket:transfer
const transferTicket=async(req,res,next)=>{
    const {id}=req.params;
    const {from,to,reason}=req.body;
    const pushObj={from,to,reason};
    try {
        const presentTicket=await ticketModel.findById(id);
        if(presentTicket.recvId===from){
            // console.log(presentTicket);
            const updatedTicket=await ticketModel.findByIdAndUpdate(id,{recvId:to,transferHistory:[pushObj,...presentTicket.transferHistory]});
            return res.json({updatedTicket});
        }else{
            throw(createError.NotFound);
        }
        
    } catch (error) {
        next(error);
    }
}

//delete ticket
const deleteOneTicket=async(req,res,next)=>{
    const {id}=req.params;
    // const {user}=req.body;
    try {
        const resultTicket=await ticketModel.findByIdAndUpdate(id,{status:'terminated',isDeleted:true});
        return res.json({resultTicket});
    } catch (error) {
        next(error);
    }
}


//update all status 
const batchUpdate=(req,res,next)=>{
    const {splitVals:objs}=req.body;
    //contain split vals
    let promises=[];
    let stats=Object.keys(objs);
    stats.forEach((status)=>{
        let list=objs[status];
        //list, which should get updated
        let ids=list.map((item)=>item._id);
        let pomich=ticketModel.updateMany({_id:{$in:ids}},{status:status});
        promises.push(pomich);
    })

    Promise.all(promises).then((result)=>{
        return res.json({msg:'success'});
    }).catch((e)=>{
        next(e);
    })
}

module.exports={
    createTicket,
    getTickets,
    getOneTicket,
    deleteOneTicket,
    transferTicket,
    updateStatus,
    batchUpdate
}