import axios from "axios";
import * as cheerio from "cheerio";
import { Finding } from "@/types/finding";
export class CrawlAgent {
    private findingsBySite = new Map<string, Finding[]>();
    private pagesBySite = new Map<string , string[]>();

    async run(siteId: string, jobId: string) {

    console.log("CRAWL AGENT CALLED");
    console.log("SITE ID :", siteId);
    console.log(`Job ID : ${jobId}`);

    const startUrl = "https://example.com";

    const MAX_PAGES = 20;

    const queue: string[] = [startUrl];

    const visited = new Set<string>();

    const allFindings: Finding[] = [];

    const pages: string[] = [];

    try {

        while (queue.length > 0 && pages.length < MAX_PAGES) {

            const currentUrl = queue.shift()!;

            if (visited.has(currentUrl)) {
                continue;
            }

            visited.add(currentUrl);

            console.log(`\nCrawling page: ${currentUrl}`);

            try {

                const response = await axios.get(currentUrl, {
                    timeout: 10000,
                    validateStatus: () => true
                });

                console.log(
                    `Status : ${response.status}`
                );

                
                if (response.status >= 400) {

                    allFindings.push({
                        pageUrl: currentUrl,
                        type: "PAGE_ERROR",
                        severity: "error",
                        message: `Page returned status ${response.status}`
                    });

                    continue;
                }

                pages.push(currentUrl);

                
                const result = this.analyzeHtml(
                    currentUrl,
                    response.data
                );

                const findings = result.findings;
                const links = result.links;

                
                allFindings.push(...findings);

                
                const linkFindings =
                    await this.checkLinks(
                        currentUrl,
                        links
                    );

                allFindings.push(...linkFindings);


            
                const baseUrl = new URL(currentUrl);

                for (const link of links) {

                    try {

                        const linkUrl = new URL(
                            link,
                            currentUrl
                        );

                        
                        if (
                            linkUrl.origin === baseUrl.origin
                        ) {

                            
                            linkUrl.hash = "";

                            const normalizedUrl =
                                linkUrl.toString();

                        
                            if (
                                !visited.has(normalizedUrl) &&
                                !queue.includes(normalizedUrl)
                            ) {

                                queue.push(normalizedUrl);

                            }

                        }

                    } catch {

            
                    }
                }


                console.log(
                    `Queue size : ${queue.length}`
                );

            } catch (error) {

                console.error(
                    `Error crawling ${currentUrl}:`,
                    error
                );

                allFindings.push({
                    pageUrl: currentUrl,
                    type: "PAGE_ERROR",
                    severity: "error",
                    message: `Unable to crawl page`
                });
            }
        }



        this.findingsBySite.set(
            siteId,
            allFindings
        );

        this.pagesBySite.set(
            siteId,
            pages
        );


        console.log("\nCrawl finished");

        console.log(
            `Pages crawled : ${pages.length}`
        );

        console.log(
            `Total findings : ${allFindings.length}`
        );

        console.log(
            "Pages found :"
        );

        console.log(pages);


        return allFindings;


    } catch (error) {

        console.error(
            "Crawl error:",
            error
        );
    }
}
    getFindings(siteId:string):Finding[]{
        return this.findingsBySite.get(siteId)?? [];
    }

    getPages(siteId : string): string[]{
        return this.pagesBySite.get(siteId)?? [] ;
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
                    type:"STRUCTURED_DATA",
                    severity: "warning",
                    message : "No JSON-LD structured data found"
                })
            } else {
                findings.push({
                    pageUrl,
                    type: "STRUCTURED_DATA",
                    severity:"info",
                    message: `Page contains ${structuredData.length} JSON-LD block(s)`
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

export const crawlAgent = new CrawlAgent() ;

