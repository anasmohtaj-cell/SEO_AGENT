export type ChangeType = 
     | "title"
     | "description"
     | "h1"
     | "content"
     | "image"
     | "structuredData"
     | "faq" 
     | "internalLinking"
     | "openGraph";

     export interface PublishingChange {
        pageId : string ;
        type : ChangeType ;
        oldValue :  string ;
        newValue : string ;
     }

     export interface ApplyChangesRequest {
        siteId : string ;
        pageUrl : string ;
        changes : PublishingChange[] ;
     }
      
     export interface ApplyChangeResult {
        pageId : string ;
        type : ChangeType ;
        status : "applied" | "failed";
        message : string ;
     }

     export interface PublishingResult {
        siteId : string ;
        pageUrl: string;
        status : "completed" | "partial" | "failed" ;
        changes : ApplyChangeResult[];
     }
     
     export interface PublishingHistory {
      historyId : string ;
      siteId : string ;
      pageUrl : string ;
      changes : PublishingChange[];
      createdAt : Date ;
     }

     export interface RollbackResult {
      historyId : string ;
      siteId : string ;
      status : "rolled_back" | "failed" ;
      message : string ;
     }