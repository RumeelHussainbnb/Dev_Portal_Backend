import express from "express";

import UserProgress from "../controllers/userProgress.js";

const router = express.Router();

router.get("/", UserProgress.onFindOrCreateCourseProgress);
router.get("/all-progress", UserProgress.onGetUserProgress);
router.put("/", UserProgress.onUpdateUserProgress);
router.get("/check/:courseId/:userId", UserProgress.onCourseStatusCheck);
router.post("/batch", UserProgress.onBatchCreate);

export default router;
