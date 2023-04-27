import express from 'express';
// controllers
import quiz from '../controllers/quiz.js';
// Authentication
import { handleTokenValidation } from '../middlewares/checkToken.js';

const router = express.Router();

// applying token middleware
// router.use(handleTokenValidation);
router.get('/getCompletedQuizByUserId', quiz.onGetQuizesResultByUserId);
router.post('/result', quiz.onPostQuizResult);
router.get('/getOne', quiz.onGetQuizById);
router.get('/', quiz.onGetAllQuizs);
router.post('/', quiz.onCreateQuiz);
router.put('/', quiz.onUpdateQuiz);
router.delete('/', quiz.onDeleteQuiz);
export default router;
