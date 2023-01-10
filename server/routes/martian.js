import express from 'express';
// controllers
import martian from '../controllers/martian.js';

const router = express.Router();

router.get('/byId', martian.onGetMartianById);
router.get('/s3Url', martian.onGetS3Url);
router.post('/martianActivity', martian.onAddActivity);
router.put('/martianActivity', martian.onEditActivity);
router.delete('/martianActivity', martian.onDeleteActivity);
router.get('/', martian.onGetMartians);
router.post('/', martian.onCreateMartian);
router.put('/', martian.onUpdateMartian);

export default router;
