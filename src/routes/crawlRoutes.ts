import {Router} from "express";
import {runCrawl} from "@/controllers/crawlController";
const router = Router();

router.post("/crawl/site/:id/run", runCrawl);

export default router ;


