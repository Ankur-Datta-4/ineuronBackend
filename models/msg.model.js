const mongoose=require('mongoose');

const MsgSchema=mongoose.Schema({
    roomId:{
        type:String,
        required:true
    },
    from:{
        
        id:{
            type:String,
        },

        name:{type:String}
    },
    to:{
        id:{
            type:String,
        },

        name:{type:String}
    },
    content:String,
    images:[String],
    isTemplate:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

const msgModel=mongoose.model('msg',MsgSchema);

module.exports=msgModel;