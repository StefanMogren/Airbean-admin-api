import { Router } from "express";
import {
	addNewMenuItem,
	deleteMenuItem,
	getAllMenuItems,
	updateMenuItem,
} from "../controllers/menu.controllers.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import { validateBody } from "../middlewares/body.validator.js";

const router = Router();

router.get("/", asyncHandler(getAllMenuItems));
router.post("/", validateBody, asyncHandler(addNewMenuItem));
router.put("/:prodId", validateBody, asyncHandler(updateMenuItem));
router.delete("/:prodId", asyncHandler(deleteMenuItem));

export default router;
