import { PublishingChange } from "@/types/publishing";

export interface CMSConnector {

    applyChange(
        change: PublishingChange
    ): Promise<void>;
}

