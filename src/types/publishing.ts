export type ChangeType = 
     | "title"
     | "description"
     | "h1"
     | "content"
     | "image"
     | "structuredData";

     export interface PublishingChange {
        pageId : string ;
        type : ChangeType ;
        oldValue :  string ;
        newValue : string ;
     }

     export interface ApplyChangesRequest {
        siteId : string ;
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
        status : "completed" | "partial" | "failed" ;
        changes : ApplyChangeResult[];
     }
