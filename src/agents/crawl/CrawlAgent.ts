export class CrawlAgent {
    async run(siteId : string ,jobId :string ){

        console.log(`Starting crawl for site ${siteId}`);
        console.log(`Job ID : ${jobId}`);
        return {
            jobId ,
            status :"started"
        };
    }
}