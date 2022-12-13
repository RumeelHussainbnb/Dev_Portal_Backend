import express from 'express';
// controllers
import martian from '../controllers/martian.js';

const router = express.Router();

router.get('/', martian.onGetMartians);
router.post('/', martian.onCreateMartian);

export default router;
