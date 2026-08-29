import {
    ApplyChangesRequest,
    PublishingResult
} from "@/types/publishing";

import { CMSConnector } from "@/connectors/CMSConnector";
import { WordPressConnector } from "@/connectors/wordpress/WordPressConnector";

export class PublishingAgent {

    private cms: CMSConnector;

    constructor() {

        this.cms = new WordPressConnector();

    }

    async applyChanges(
        request: ApplyChangesRequest
    ): Promise<PublishingResult> {

        console.log(
            `Starting publishing for site: ${request.siteId}`
        );

        const results = [];

        for (const change of request.changes) {

            try {

                console.log(
                    `Applying change: ${change.type}`
                );

                await this.cms.applyChange(change);

                results.push({

                    pageId: change.pageId,

                    type: change.type,

                    status: "applied" as const,

                    message: "Change applied successfully"

                });

            } catch (error) {

                console.error(
                    `Failed to apply ${change.type}:`,
                    error
                );

                results.push({

                    pageId: change.pageId,

                    type: change.type,

                    status: "failed" as const,

                    message: "Failed to apply change"

                });

            }
        }

        const failed =
            results.filter(
                change => change.status === "failed"
            );

        let status: PublishingResult["status"];

        if (failed.length === 0) {

            status = "completed";

        } else if (failed.length < results.length) {

            status = "partial";

        } else {

            status = "failed";

        }

        return {

            siteId: request.siteId,

            status,

            changes: results

        };
    }
}