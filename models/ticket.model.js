const mongoose=require('mongoose');


// status=["Pending","In Progress","Completed"];
const TicketSchema=mongoose.Schema({
    creatorId:{
        type:String,
        required:true
    },
    recvId:{
        type:String,
        required:true
    },
    transferHistory:[
        {
            from:String,
            reason:String,
            to:String
        }
    ],
    status:{
        type:String,
        default:'Pending'
    },
    content:{
        type:String,
        required:true
    },
    tags:[String],
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


const model=mongoose.model('Ticket',TicketSchema);

module.exports=model;