const express = require('express');
const router = express.Router();
const urlControl = require('../controllers/urlController')

router
.route('/:code')
.get(urlControl.GetUrl);

router
.route('/api/url/shorten')
.post(urlControl.createUrl);

module.exports = router;