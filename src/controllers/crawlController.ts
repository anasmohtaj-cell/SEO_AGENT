import { Request , Response } from "express";
import {CrawlAgent} from "@/agents/crawl/CrawlAgent";
const crawlAgent = new CrawlAgent();

export const runCrawl = (req: Request , res:Response)=>{
    const siteId = String(req.params.id);

    const jobId =`crawl-${Date.now()}`;

    console.log("Controller called");
    console.log("SIte ID", siteId);
    console.log("Job ID:", jobId);

    res.status(202).json({
        jobId,
        status : "started"
    });

    console.log("Calling CrawlAgent...");

    crawlAgent.run(siteId , jobId);

    console.log("CrawlAgent.run( ) called");
}
