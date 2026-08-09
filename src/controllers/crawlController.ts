import { Request , Response } from "express";
import {CrawlAgent} from "@/agents/crawl/CrawlAgent";
const crawlAgent = new CrawlAgent();
export const runCrawl = async(req: Request , res:Response)=>{
    const siteId = String(req.params.id);
    const jobId =`crawl-${Date.now()}`;
    res.status(202).json({
        jobId,
        status : "started"
    });
    crawlAgent.run(siteId , jobId);
}