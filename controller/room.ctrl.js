const roomModel=require('../models/room.model');
const createError = require('http-errors');
const UserModel=require('../models/user.model');


//create room: only admin
const createRoom=async(req,res,next)=>{
    //body contains:name,description, admin:{name,id}
    try {
        const room=await roomModel.create({...req.body});
        const user=await UserModel.findById(req.body.admins[0].id);
        const rooms=[room._id,...user.rooms];
        const updatedUser=await UserModel.findByIdAndUpdate(user._id,{rooms},{new:true});
        if(!room) throw(createError.NotAcceptable);
        return res.json({room,userRooms:updatedUser.rooms});
    } catch (error) {
        throw(error);
    }
}


const getRoomCode=async(req,res,next)=>{
    const {id}=req.params;
    const {uid}=req.body; //need to pass requesting user: only share if admin
    try {
        const room=await roomModel.findById(id);
        if(!room) throw(createError.NotFound);

        const findAdmin=room.admins.find(item=>item.id===uid);
        if(!findAdmin) throw(createError[406]);
        return res.json({code:room.slug});
    } catch (error) {
        next(error);
    }
}

//join room: students+admins
const joinRoom=async(req,res,next)=>{
    const {name,uid,code}=req.body;
    const {id}=req.params;
    try {
        const room=await roomModel.findById(id);
        if(!room) throw(createError(404,'Room doesnt exist'));

        //distinguish if admin;
        const user=await UserModel.findById(uid);
        
        if(!user) throw(createError(404,'user doesnt exist'));

        if(user.isAdmin){
            
                const findAdmin=room.admins.find((ele)=>ele.id===uid);
                if(findAdmin) return res.json({msg:`Already present`});
                
                if(code!==room.slug) throw(createError(404,`Invalid Room code`));

                let obj={name,id:uid};
                const admins=[obj,...room.admins];

                const updatedRoom=await roomModel.findByIdAndUpdate(id,{admins});
            
        }else{
            
                const findUser=room.users.find((ele)=>ele.id===uid);
                if(findUser) return res.json({msg:`Already present`});
                
                if(code!==room.slug) throw(createError(404,`Invalid Room code`));
                let obj={name,id:uid};
                const users=[obj,...room.users];
                const updatedRoom=await roomModel.findByIdAndUpdate(id,{users});
        }
        let rooms=[room._id,...user.rooms];
        let updatedUser=await UserModel.findByIdAndUpdate(user._id,{rooms});
        res.json({roomName:room.name,msg:`Added ${name}`,rooms});
    } catch (error) {
        next(error);
    }
}


//send other admins in the room
const otherAdmins=async(req,res,next)=>{
    const {roomId}=req.params;
    try {
        const room=await roomModel.findById(roomId);
        if(!room) throw(createError(404,`Room not found`));

        return res.json({admins:room.admins});
    } catch (error) {
        next(error);
    }
}

//get rooms for 1 user
const getRooms=async(req,res,next)=>{
    const {uid}=req.params;
    try {
        const user=await UserModel.findById(uid);
        if(!user) throw(createError(404,`USer not found`));
        const ids=user.rooms;
        let promises=[];

        ids.forEach((room)=>{
            let pomich=roomModel.findById(room);
            promises.push(pomich);
        })

        Promise.all(promises).then((res)=>{
            console.log(res);
            return res.json({data:res});
        }).catch((e)=>{
            
            console.log(`Error while resolving promises`);
            console.log(e);
            throw(e);
        })

    } catch (error) {
        next(error)
    }   
}

const getRoom=async(req,res,next)=>{
    const {id}=req.params;
    try {
        const room=await roomModel.findById(id);
        if(!room) throw(createError(404,'room not found'));
        return res.json({room});
    } catch (error) {
        next(error);
    }
}

const getRoomQuery=async(id)=>{
    try{
        const room=await roomModel.findById(id);
        return room;
    }catch(e){
        return `error`;
    }
}
module.exports={
    createRoom,
    otherAdmins,
    joinRoom,
    getRoomCode,
    getRooms,
    getRoom,
    getRoomQuery
}