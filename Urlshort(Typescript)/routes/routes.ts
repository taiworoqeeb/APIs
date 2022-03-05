import express from 'express';
const router = express.Router();
import { GetUrl, createUrl } from '../controllers/urlController';

router
.route('/:code')
.get(GetUrl);

router
.route('/api/url/shorten')
.post(createUrl);

export { router };