import { Router } from "express";
import {
	getAllMenuItems,
	seedMenu,
	addMenuItem,
} from "../controllers/menu.controller.js";
import asyncHandler from "../utils/asyncHandler.util.js";

const router = Router();

router.get("/", asyncHandler(getAllMenuItems));
router.post("/seed", asyncHandler(seedMenu));
router.post("/", asyncHandler(addMenuItem));

export default router;
