import express from "express";

import course from "../controllers/courses.js";

const router = express.Router();

router.get("/", course.onGetAllCourse);
router.post("/", course.onCreateCourse);
router.put("/:id", course.onUpdateCourse);

export default router;
