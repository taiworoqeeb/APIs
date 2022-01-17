const express = require('express');
const router = express.Router();
const customer = require('../controller/customercontroller');
const { profile, userAuth, RegisterUser, LoginUser, checkRole, getUser, getUsers, updateUser, deleteUser }= require('../controller/staffcontroller');
const passport = require('passport');
const complain = require('../controller/complaincontroller');


router
.route('/customers')
.get(customer.GetAll);

router
.route('/customers/:id')
.get(customer.GetOne);

router
.route('/customers/status/:id')
.patch(customer.activate_deactivate);

/*router
.get('/dashboard/profile', userAuth, async(req, res) => {
    return res.json(profile(req.user));
});*/

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
.get(userAuth, async(req, res) => { return res.json(profile(req.user)) })
.get('/users', userAuth, checkRole(['admin']), getUsers )
.get('/user/:username', userAuth, checkRole(['admin']), getUser)
.patch('/user-update/:username', userAuth, checkRole(['admin']), updateUser)
.delete('/delete-user/:username', userAuth, checkRole(['admin']), deleteUser);


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