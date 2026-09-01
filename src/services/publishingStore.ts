import {
    PublishingHistory ,
    PublishingResult
} from "@/types/publishing";

class PublishingStore {
    private results : Map<string , PublishingResult[]> = new Map();
    private history : Map<string , PublishingHistory> = new Map();

    saveResult(result: PublishingResult):void{

        const siteResults = this.results.get(result.siteId)?? [];

        siteResults.push(result) ;

        this.results.set( result.siteId , siteResults);
    }

    getResults(siteId : string): PublishingResult[]{
        return this.results.get(siteId)?? [] ;
    }
    
    saveHistory(history : PublishingHistory): void {
        this.history.set(history.historyId , history)
    }

    getHistory(
        historyId : string 
    ): PublishingHistory | undefined{
        return this.history.get(historyId);
    }

    getSiteHistory(
        siteId: string 
    ) : PublishingHistory[] {
        return Array.from(
            this.history.values()
        ).filter(
            history => history.siteId === siteId
        );
    }
}

export const publishingStore = new PublishingStore();