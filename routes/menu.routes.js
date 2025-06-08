import { Router } from "express";
import {
	addNewMenuItem,
	deleteMenuItem,
	getAllMenuItems,
	updateMenuItem,
} from "../controllers/menu.controllers.js";
import asyncHandler from "../utils/asyncHandler.util.js";

const router = Router();

router.get("/", asyncHandler(getAllMenuItems));
router.post("/", asyncHandler(addNewMenuItem));
router.put("/:prodId", asyncHandler(updateMenuItem));
router.delete("/prodId", asyncHandler(deleteMenuItem));

export default router;
