import express from "express";

import course from "../controllers/courses.js";

const router = express.Router();

router.get("/", course.onGetAllCourse);
router.post("/", course.onCreateCourse);
router.put("/:id", course.onUpdateCourse);
router.get("/only-name", course.onOnlyReturnName);
router.get("/full-course/:id", course.onGetFullCourse);
router.get("/:slug", course.onGetCourseBySlug);
router.get("/full-course-slug/:slug", course.onGetFullCourseBySlug);

export default router;
