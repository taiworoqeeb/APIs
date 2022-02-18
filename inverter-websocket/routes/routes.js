const express = require('express');
const router = express.Router()
const ws = require('../controllers/socket');
const { profile, userAuth, RegisterUser, LoginUser, checkRole, getUser, getUsers, updateUser, deleteUser } = require('../controllers/staffcontroller');


router.post('/dashboard/status/subscribe', userAuth, ws.Subscribe);
router.post('/dashboard/status/unsubscribe', userAuth, ws.Unsubscribe);
router.post('/dashboard/status/control', userAuth, ws.Control);
router.post('/dashboard/status/control_lock', userAuth, ws.Control_Lock);
router.post('/dashboard/status/control_unlock', userAuth, ws.Control_Unlock);
router.post('/dashboard/status/control_on', userAuth, ws.Control_On);
router.post('/dashboard/status/control_off', userAuth, ws.Control_Off);
router.post('/dashboard/status/control_alarmOn', userAuth, ws.Control_AlarmOn);
router.post('/dashboard/status/control_alarmOff', userAuth, ws.Control_AlarmOff);


//staff
router
.post('/auth/register-staff', async (req, res) => {
    await RegisterUser("staff", req, res)
});
    
    

router
.post('/auth/signin-staff', async (req, res) => {
    await LoginUser("staff", req, res);
});

//admin
router
.post('/auth/register-admin', async (req, res) => {
    await RegisterUser("admin", req, res)
});

router
.post('/auth/signin-admin', async (req, res) => {
    await LoginUser("admin", req, res);
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
       return res.json('successfully logged out')
    })
    res.clearCookie('connect.sid');
    
   // return res.redirect('/dashboard')
});

module.exports = router;