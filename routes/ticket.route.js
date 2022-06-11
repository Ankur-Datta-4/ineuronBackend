const { getTickets, createTicket, getOneTicket, updateStatus, deleteOneTicket, transferTicket, batchUpdate } = require('../controller/ticket.ctrl');
// const { route } = require('./api.route');

const router=require('express').Router();


router.route('/u/:uid')
    .get(getTickets)
    .post(createTicket)
    .patch(batchUpdate);

    
router.route('/:id')
    .get(getOneTicket)
    .patch(updateStatus)
    .delete(deleteOneTicket);



router.route('/transfer/:id')
    .patch(transferTicket);


module.exports=router;