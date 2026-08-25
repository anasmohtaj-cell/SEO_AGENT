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

export const getFindings = (req: Request , res : Response)=>{
    const siteId = String(req.params.id);
    let findings = crawlAgent.getFindings(siteId);
    
    //Filters
    const {type , severity , pageUrl} = req.query
    if(type){
        findings = findings.filter(
            finding => finding.type === String(type)
        );
    }
    if(severity){
        findings = findings.filter(
            finding => finding.severity === String(severity)
        )
    }
    if(pageUrl){
        findings = findings.filter(
            finding=> finding.pageUrl === String(pageUrl)
        );
    }
    //Pagination
    const page = Math.max(Number(req.query.page) || 1 , 1);
    const limit = Math.max(Number(req.query.limit) || 10 , 1);
    const total = findings.length ;
    const start =(page - 1)* limit ;
    const end = start + limit;
    const paginatedFindings = findings.slice(start , end);

    res.status(200).json({
        siteId ,
        page ,
        limit ,
        total ,
        totalPages : Math.ceil(total / limit),
        findings: paginatedFindings
    });



};
