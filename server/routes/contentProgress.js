import express from "express";

import contentProgress from "../controllers/contentProgress.js";

const router = express.Router();

router
  .get("/progress", contentProgress.onGetUserProgress)
  .post("/progress", contentProgress.onCreateContentProgress)
  .put("/progress", contentProgress.onUpdateUserProgress)
  .get("/coursestatus", contentProgress.onCourseStatusCheck);

export default router;
