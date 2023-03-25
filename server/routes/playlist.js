import express from 'express';
// controllers
import playlist from '../controllers/playlist.js';
import { handleTokenValidation } from '../middlewares/checkToken.js';

const router = express.Router();

router.get('/bnb', playlist.onGetPlaylist);
// applying token middleware
router.use(handleTokenValidation);
router.post('/bnb', playlist.onPostPlaylist);

export default router;
