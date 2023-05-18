import express from "express";

import Lesson from "../controllers/Lesson.js";

const router = express.Router();

router.get("/", Lesson.onGetAllLesson);
router.get("/:id", Lesson.onGetLessonById);
router.post("/", Lesson.onCreateLesson);
router.put("/:id", Lesson.onUpdateLesson);
router.delete("/:id", Lesson.onDeleteLesson);
router.get("/nextLesson/:id", Lesson.onFindNextLesson);

export default router;
