import { PublishingChange } from "@/types/publishing";

export interface CMSConnector {

    applyChanges(
        pageUrl : string ,
        change: PublishingChange[]
    ): Promise<void>;
}

