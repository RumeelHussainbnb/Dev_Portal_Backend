import express from "express";

import UserProgress from "../controllers/userProgress.js";

const router = express.Router();

router.post("/", UserProgress.onFindOrCreateCourseProgress);
router.get("/all-progress/:userId/:courseId", UserProgress.onGetUserProgress);
router.put("/", UserProgress.onUpdateUserProgress);
router.get("/:userId/:lessonId", UserProgress.onGetUserProgressByLessonId);

export default router;
