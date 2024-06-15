import { Router } from "express";
import { getInventory } from "../controllers/inventory.controller.js";
import dataLoader from "../middlewares/inventory.middleware.js";

const router = Router();

router.get("/inventory", dataLoader, getInventory);

export default router;
