import axios from "axios";
import * as cheerio from "cheerio";
import { Finding } from "@/types/finding";
export class CrawlAgent {
    async run(siteId : string ,jobId :string ){
gi
        console.log("CRAWL AGENT CALLED");
        console.log("SITE ID :" , siteId);
        console.log(`Job ID : ${jobId}`);

        const url = "https://example.com";
        try{
            console.log("Fetching ", url);
            
            const response = await axios.get(url);

            console.log("Status :", response.status);

            const findings = this.analyzeHtml(url , response.data);

   

             console.log("Findings :");
             console.log(findings);
             return findings ;
    
    
            
        }
        
        catch(error){
            console.error("Crawl error:" , error);
        }
    }
    private analyzeHtml(pageUrl: string , html : string):Finding[]{
           
            const $ = cheerio.load(html);
            const findings : Finding[]=[]

            const title =$("title").text().trim();

            const h1 = $("h1")
                   .map((_, element)=>$(element).text().trim())
                   .get();
            const h2 = $("h2")
                    .map((_, element)=>$(element).text().trim())
                    .get();
            const links = $("a[href]")
                    .map((_, element)=>$(element).attr("href"))
                    .get();
           
             // TITLE
             if(!title){
                findings.push({
                   pageUrl ,
                   type: "TITLE_MISSING",
                   severity: "warning",
                   message: "No title tag found"
                });
             }else{
                findings.push({
                    pageUrl ,
                    type : "TITLE",
                    severity: "info",
                    message: `Title found : ${title}`
                });
             }

             //H1
             if(h1.length === 0){
                findings.push({
                    pageUrl ,
                    type : "H1_MISSING",
                    severity: "warning",
                    message: "No H1 tag found"
                });
             } else {
                findings.push({
                    pageUrl ,
                    type : "H1",
                    severity: "info",
                  message : `Page contains ${h1.length} H1 tag(s)`
                })
             }
             //H2
             findings.push({
                pageUrl ,
                type : "H2",
                severity: "info",
               message : `Page contains ${h2.length} H2 tag (s) `
             });
             
             //Links
             findings.push({
                pageUrl ,
                type : "LINKS",
                severity : "info",
               message : `Page contains ${links.length} link(s)`
             })
            return findings;
    }
}