import { Router } from "express";
import {
	addNewMenuItem,
	deleteMenuItem,
	getAllMenuItems,
	updateMenuItem,
} from "../controllers/menu.controllers.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import { validateBody } from "../middlewares/body.validator.js";
import { verifyAdmin } from "../middlewares/admin.validator.js";

const router = Router();

router.get("/", asyncHandler(getAllMenuItems));
router.post("/", verifyAdmin, validateBody, asyncHandler(addNewMenuItem));
router.put("/:prodId", verifyAdmin, validateBody, asyncHandler(updateMenuItem));
router.delete("/:prodId", verifyAdmin, asyncHandler(deleteMenuItem));

export default router;
