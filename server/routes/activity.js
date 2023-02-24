import express from 'express';
// controllers
import activity from '../controllers/activity.js';

const router = express.Router();

router.get('/', activity.onGetMartianActivityByPage);
router.post('/', activity.onCreateActivity);
router.put('/', activity.onEditActivity);
router.delete('/', activity.onDeleteActivity);

export default router;
