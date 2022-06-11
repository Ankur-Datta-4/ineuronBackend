const mongoose=require('mongoose');
const random=require('randomstring')

const RoomSchema=mongoose.Schema({
    slug:{
        type:String,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    desc:{
        type:String,
    },
    admins:[{
        name:String,
        id:String
    }],
    users:[{
        name:String,
        id:String
    }],
    isGeneral:{
        type:Boolean,
        default:false
    }
        
    
})

RoomSchema.pre('validate',function(next){

        this.slug=random.generate(6);
     
    next()
  })

const roomModel=mongoose.model('Room',RoomSchema);

module.exports=roomModel;