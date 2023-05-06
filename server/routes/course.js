import express from "express";

import course from "../controllers/course.js";

const router = express.Router();

router.get("/", course.onGetAllCourse);
router.get("/:id", course.onGetCourseById);
router.post("/", course.onCreateCourse);
router.put("/:id", course.onUpdateCourse);
router.delete("/:id", course.onDeleteCourse);
router.get("/nextcourse/:id", course.onFindNextCourse);

export default router;
