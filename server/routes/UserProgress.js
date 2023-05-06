import express from "express";

import contentProgress from "../controllers/courseProgress.js";

const router = express.Router();

router.get("/", contentProgress.onGetUserProgress);
router.post("/", contentProgress.onFindOrCreateContentProgress);
router.put("/", contentProgress.onUpdateUserProgress);
router.get("/coursestatus", contentProgress.onCourseStatusCheck);

export default router;
