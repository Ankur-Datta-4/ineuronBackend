const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
    },
    photoURL:{
        type:String,
        default:'https://robohash.org/ss'
    },
    rooms:[String],
    isAdmin:{
        type:Boolean,
        default:false
    }
});

const model=mongoose.model('User',UserSchema);

module.exports=model;