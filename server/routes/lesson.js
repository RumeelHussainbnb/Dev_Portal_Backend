import express from "express";

import lesson from "../controllers/lesson.js";

const router = express.Router();

router.get("/", lesson.onGetAllLesson);
router.get("/:id", lesson.onGetLessonById);
router.post("/", lesson.onCreateLesson);
router.put("/:id", lesson.onUpdateLesson);
router.delete("/:id", lesson.onDeleteLesson);
router.get("/nextLesson/:id", lesson.onFindNextLesson);

export default router;
