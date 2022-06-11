const { getMessage, sendMessage } = require('../controller/msg.ctrl');

const router=require('express').Router();

router.route('/:roomId')
    .get(getMessage)
    .post(sendMessage);

module.exports=router;