import { Router } from "express";
import { runCrawl, getFindings } from "@/controllers/crawlController";

const router = Router();

router.post("/crawl/site/:id/run", runCrawl);
router.get("/crawl/site/:id/findings", getFindings);

export default router;