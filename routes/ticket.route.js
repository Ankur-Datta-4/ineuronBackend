const { getTickets, createTicket, getOneTicket, updateStatus, deleteOneTicket, transferTicket, batchUpdate, answerTicket } = require('../controller/ticket.ctrl');
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

router.route('/answer/:id')
    .patch(answerTicket);

module.exports=router;