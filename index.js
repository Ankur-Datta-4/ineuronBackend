const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const cors=require('cors')
const mongoose=require('mongoose');
require('dotenv').config();
// mongodb+srv://me:Ka04mw1613@cluster0.82mqnkd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const app = express();

// mongodb://localhost:27017/neuroQuery

const MONGO_URI='mongodb://localhost:27017/neuroQuery';
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
app.listen(PORT, async() =>{ 
  console.log(`🚀 @ http://localhost:${PORT}`);
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to DB`);

});
