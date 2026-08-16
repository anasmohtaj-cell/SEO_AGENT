import axios from "axios";
import * as cheerio from "cheerio";
import { Finding } from "@/types/finding";
export class CrawlAgent {
    async run(siteId : string ,jobId :string ){

        console.log("CRAWL AGENT CALLED");
        console.log("SITE ID :" , siteId);
        console.log(`Job ID : ${jobId}`);

        const url = "https://example.com";
        try{
            console.log("Fetching ", url);
            
            const response = await axios.get(url);

            console.log("Status :", response.status);

            const result = this.analyzeHtml(url , response.data);

            const findings = result.findings;
            const links = result.links;

            const linkFindings = await this.checkLinks(url, links)
            
            findings.push(...linkFindings);

   

             console.log("Findings :");
             console.log(findings);
             return findings ;
    
    
            
        }
        
        catch(error){
            console.error("Crawl error:" , error);
        }
    }
    private analyzeHtml(pageUrl: string , html : string):{
        findings : Finding[];
        links : string[];
    }{
           
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
                        .map((_, element) => $(element).attr("href") ?? "")
                        .get();
            const structuredData = $('script[type="application/ld+json"]')
                        .map((_,element)=>$(element).html()?.trim() ?? "")
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
           
            //structure data
            if(structuredData.length === 0){
                findings.push({
                    pageUrl,
                    type:"STRUCT_DATA",
                    severity: "warning",
                    message : "No JSON-LD structured data found"
                });
            } else {
                findings.push({
                    pageUrl,
                    type: "STRUCTURED_DATA",
                    severity:"info",
                    message: `Page contains ${structuredData.length} JSON-LD block(s)`
                });
            }
            //FAQ
            if (structuredData.length > 0){
                findings.push({
                    pageUrl ,
                    type : "STRUCTURED_DATA",
                    severity : "info",
                    message :` Page contains ${structuredData.length} JSON-LD block (s)`
                });
            } else {
                findings.push({
                    pageUrl , 
                    type : "STRUCTURED_DATA",
                    severity: "warning",
                    message : "No JSON-LD structured data found"
                });
            }
                      let hasFaq = false ;
                      for (const data of structuredData){
                        try {
                            const json = JSON.parse(data);
                            
                            if(
                                json["@type"] === "FAQPage" || (Array.isArray(json["@graph"])&&
                            json["@graph"].some((item: any) => item["@type"] === "FAQPage"))
                            ){
                                   hasFaq = true ;
                                   break ;
                            }
                        }catch {

                        }
                      }

                    findings.push({
                        pageUrl ,
                        type : "FAQ",
                        severity : hasFaq ? "info" : "warning",
                        message : hasFaq 
                        ? "FAQPage structured data found": "No FAQPage structured data found"
                    }); 
             return { 
                findings,
                links
            } ;
             }
   private async checkLinks(
    pageUrl : string ,
    links : string[]
   ): Promise<Finding[]>{
      const findings : Finding[] = [];
      for (const link of links){
          try{
            const response = await axios.get(link , {
                maxRedirects : 0 ,
                validateStatus: () => true
            });
            console.log(`LINK : ${link} -> ${response.status}`);
            if(response.status === 404){
                findings.push({
                    pageUrl ,
                    type: "Broken_Link",
                    severity: "error",
                    message : `Broken link: ${link}`
                })
            }
            if(response.status<400 && response.status>=300){
                findings.push({
                    pageUrl,
                    type : "REDIRECT",
                    severity : "warning",
                    message :`REdirect found : ${link}`
                });
            }
          } catch (error) {
            findings.push({
                pageUrl ,
                type : "LINK_ERROR",
                severity : "error",
                message : `Unable to access link : ${link}`
            });
          }
       
      }
      return findings;
   }
}