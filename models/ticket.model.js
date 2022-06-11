const mongoose=require('mongoose');


// status=["Pending","In Progress","Completed"];
const TicketSchema=mongoose.Schema({
    creator:{
        name:String,
        id:String
    },
    recv:{
        name:String,
        id:String
    },
    transferHistory:[
        {
            from:{
                name:String,
                id:String
            },
            reason:String,
            to:{
                name:String,
                id:String
            }
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
    },
    answer:String
},{timestamps:true});


const model=mongoose.model('Ticket',TicketSchema);

module.exports=model;