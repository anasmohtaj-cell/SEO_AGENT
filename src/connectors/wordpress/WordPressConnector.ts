import { CMSConnector } from "../CMSConnector";
import { PublishingChange } from "@/types/publishing";

export class WordPressConnector implements CMSConnector{

    async applyChange(change: PublishingChange): Promise<void> {
        console.log(`Applying ${change.type} to WordPress page ${change.pageId}`);

        console.log(`Old Value : ${change.oldValue}`);

        console.log(`New Value : ${change.newValue}`);

        await new Promise(resolve => 
            setTimeout(resolve,300)
        );

        console.log( `WordPress change applied successfully`);
        
    }

     
}