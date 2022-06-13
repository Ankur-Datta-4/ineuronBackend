const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const cors=require('cors')
const mongoose=require('mongoose');
const { getRoomQuery } = require('./controller/room.ctrl');
require('dotenv').config();
// mongodb+srv://me:Ka04mw1613@cluster0.82mqnkd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const app = express();

// mongodb://localhost:27017/neuroQuery

const MONGO_URI='mongodb+srv://me:Ka04mw1613@cluster0.82mqnkd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(morgan('dev'));
app.use('/api/ticket',require('./routes/ticket.route'));
app.use('/api/user',require('./routes/user.route'));
app.use('/api/room',require('./routes/room.route'))
app.use('/api/msg',require('./routes/msg.route'))



app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
const server=app.listen(PORT, async() =>{ 
  console.log(`🚀 @ http://localhost:${PORT}`);
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to DB`);

});

const io=require('socket.io')(server,{
  pingTimeout:6000,
  cors:{
    origin:'http://localhost:3000'
  }
});

io.on('connection',(socket)=>{
  console.log(`connected`);

  //form the room
  socket.on('setup',(user)=>{
    socket.join(user);
    socket.emit('connected');
    console.log(`user:${user}`)
  })


  socket.on('join_room',(room)=>{
    socket.join(room);
    console.log(`user joined room:${room}`)
  })

  socket.on('new_msg',(msg)=>{
    const roomId=msg.roomId;
    if(!roomId){
      console.log(`Chat.room not defined`);
      return;
    }
    
    const chat=getRoomQuery(roomId);


    

    //for all admins
    chat.admins.forEach((user) => {
      if(user.id===msg.from.id) return;
      socket.in(user.id).emit('msg_rcvd',msg);
    });
    // send it to all users in the socket 
    //for all users
    
    chat.users.forEach((user) => {
      if(user.id===msg.from.id) return;
      socket.in(user.id).emit('msg_rcvd',msg);
    });
  })
})
