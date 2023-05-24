import express from "express";

import UserProgress from "../controllers/userProgress.js";

const router = express.Router();

router.get("/", UserProgress.onFindOrCreateCourseProgress);
router.get("/all-progress/:userId/:courseId", UserProgress.onGetUserProgress);
router.put("/", UserProgress.onUpdateUserProgress);

export default router;
