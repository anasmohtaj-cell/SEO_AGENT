import axios from "axios";
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
            console.log("page loaded successfully");
        }
        catch(error){
            console.error("Crawl error:" , error);
        }
    }
}