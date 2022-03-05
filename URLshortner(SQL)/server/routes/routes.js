const express = require('express')
const router = express.Router();
const urlControl = require('../controllers/urlcontroller');

router
.route('/:code')
.get(urlControl.GetUrl);

router
.route('/api/url/shorten')
.post(urlControl.createUrl);



module.exports = router;