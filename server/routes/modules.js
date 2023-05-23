import express from "express";

import modules from "../controllers/modules.js";

const router = express.Router();

router.get("/", modules.onGetAllModules);
router.post("/", modules.onCreateModule);
router.put("/:id", modules.onUpdateModules);
router.get("/:id", modules.onGetModuelById);

export default router;
