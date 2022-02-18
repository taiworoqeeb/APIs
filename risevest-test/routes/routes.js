const express = require('express');
const router = express.Router()
const { profile, userAuth, RegisterUser, LoginUser, checkRole, getUser, getUsers, updateUser, deleteUser } = require('../controllers/usercontroller');
const {Uploads, Download, Listfiles, FileAttribute} = require('../controllers/uploadcontroller');
//const {Download} = require('../controllers/uploadcontroller');
//user
router
.post('/auth/register-user', async (req, res) => {
    await RegisterUser("user", req, res)
});

router
.post('/auth/signin-user', async (req, res) => {
    await LoginUser("user", req, res);
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
.route('/upload/:username')
.post(userAuth, Uploads)

router
.route('/download/:username')
.post(userAuth, Download)

router
.route('/listfiles')
.get(userAuth, checkRole(["admin"]), Listfiles)

router
.route('/filestatus')
.delete(userAuth, checkRole(["admin"]), FileAttribute)

module.exports = router;