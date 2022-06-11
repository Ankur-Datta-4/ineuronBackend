const { createRoom, joinRoom, getRoomCode, otherAdmins, getRooms } = require('../controller/room.ctrl');

const router=require('express').Router();

router.route('/')
    .post(createRoom);

router.route('/:id')
    .patch(joinRoom);

router.route('/code/:id')
    .get(getRoomCode);

router.route('/admins/:roomId')
    .get(otherAdmins);

router.route('/u/:uid')
    .get(getRooms);


    module.exports=router;
