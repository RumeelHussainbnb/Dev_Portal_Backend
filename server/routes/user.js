import express from 'express';
// controllers
import user from '../controllers/user.js';
import { handleTokenValidation } from '../middlewares/checkToken.js';
import { fileUpload } from '../middlewares/fileUpload.js';

const router = express.Router();
router.get('/getAllUsers', user.onGetAllUser);
router.get('/getMartians', user.onGetMartians);
router.get('/:publicKey?', user.onGetUser);
router.get('/id/:Id?', user.onGetUserById);
// applying token middleware
router.use(handleTokenValidation);

router.get('/getUserProfile/:userID', user.onGetUserProfile);
router.get('/onGetUserProfileWithData/:userID', user.onGetUserProfileWithData);
router.put('/updateUserProfile/:userID', user.onUpdateUserProfile);
router.post('/createUser', user.onCreateUser);
router.post(
  '/addUserProfile/:userID',
  fileUpload.single('profileImage'),
  user.onAddUserProfil
);

export default router;
