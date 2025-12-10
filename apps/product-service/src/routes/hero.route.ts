import { Router } from "express";
import {
  batchUpdateHeroProducts,
  reorderHeroProducts,
  clearAllHeroProducts,
  getHeroProductsStats,
} from "../controllers/hero.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

// All routes require admin authentication
router.post("/batch-update", shouldBeAdmin, batchUpdateHeroProducts);
router.post("/reorder", shouldBeAdmin, reorderHeroProducts);
router.delete("/clear", shouldBeAdmin, clearAllHeroProducts);
router.get("/stats", getHeroProductsStats);

export default router;
