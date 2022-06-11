const { createUser, loginUser, getUserTickets, getUserRooms, getUser } = require('../controller/user.ctrl');

const router=require('express').Router();

router.route('/')
    .post(createUser)

router.route('/login').post(loginUser);

router.route('/tickets/:uid').get(getUserTickets);
router.route('/rooms/:id').get(getUserRooms);
router.route('/admin/:id').get(getUser);

module.exports=router;
