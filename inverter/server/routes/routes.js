const express = require('express');
const router = express.Router();
const customer = require('../controller/customercontroller');
const { profile, userAuth, RegisterUser, LoginUser, checkRole, getUser, getUsers, updateUser, deleteUser } = require('../controller/staffcontroller');
const complain = require('../controller/complaincontroller');
const comment = require('../controller/commentcontroller');
const reply = require('../controller/replycontroller')


router
.route('/customers')
.get(customer.GetAll);

router
.route('/customers/:id')
.get(customer.GetOne);

router
.route('/customers/status/:id')
.patch(customer.activate_deactivate);

//Complains route
router
.route('/dashboard/complains')
.get(userAuth, complain.getAll)
.post(complain.CreateComplain);

router
.route('/dashboard/complain/:ticketId')
.get(userAuth, complain.getOne)
.delete(userAuth, complain.DeleteComplain)

//Commnet route
router
.route('/dashboard/complain/comments')
.get(comment.GetAllComments)

router
.route('/dashboard/complain/:ticketId/comment')
.post(comment.CreateComment)

router
.route('/dashboard/complain/:ticketId/comment')
.get(comment.GetComment)
.delete(comment.DeleteComment)

//Reply route
router
.route('/dashboard/complain/:ticketId/comment/reply')
.post(reply.CreateReply)

router
.route('/dashboard/complain/comments/reply')
.get(reply.GetAllReplies)

router
.route('/dashboard/complain/:ticketId/comment/reply/')
.get(reply.GetReply)
.delete(reply.DeleteReply)

//staff
router
.post('/auth/register-staff', async (req, res) => {
    await RegisterUser("staff", req, res)});
    //res.redirect('/')

router
.post('/auth/signin-staff', async (req, res) => {
    await LoginUser("staff", req, res);
    //res.redirect('/dashboard');
});

//admin
router
.post('/auth/register-admin', async (req, res) => {
    await RegisterUser("admin", req, res)});
    //res.redirect('/')

router
.post('/auth/signin-admin', async (req, res) => {
    await LoginUser("admin", req, res);
    //res.redirect('/dashboard');
});

router
.route('/dashboard/profile')
.get(userAuth, async(req, res) => { 
    return res.json(profile(req.user)) 
});

router.get('/dashboard/profile/users', userAuth, checkRole(['admin']), getUsers );
router.get('/dashboard/profile/user/:username', userAuth, checkRole(['admin']), getUser);
router.patch('/dashboard/profile/user-update/:username', userAuth, checkRole(['admin']), updateUser);
router.delete('/dashboard/profile/delete-user/:username', userAuth, checkRole(['admin']), deleteUser);


router
.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.json('successfully logged out')
    })
    res.clearCookie('connect.sid');
    
    //res.redirect('/')
});

module.exports = router;