import {
    ApplyChangesRequest,
    PublishingResult,
    PublishingHistory,
    RollbackResult
} from "@/types/publishing";

import {
    publishingStore
} from "@/services/publishingStore";

import {
    CMSConnector
} from "@/connectors/CMSConnector";

export class PublishingAgent {

    private connector: CMSConnector;

    constructor(
        connector: CMSConnector
    ) {
        this.connector = connector;
    }

    async applyChanges(
        request: ApplyChangesRequest
    ): Promise<PublishingResult> {

        console.log(
            `Starting publishing for site: ${request.siteId}`
        );

        try {

            await this.connector.applyChanges(
                request.pageUrl,
                request.changes
            );

            const result: PublishingResult = {

                siteId: request.siteId,

                pageUrl: request.pageUrl,

                status: "completed",

                changes: request.changes.map(
                    change => ({
                        pageId: change.pageId,
                        type: change.type,
                        status: "applied",
                        message: "Change applied successfully"
                    })
                )
            };

            publishingStore.saveResult(result);

            const history: PublishingHistory = {

                historyId: this.generateHistoryId(),

                siteId: request.siteId,

                pageUrl: request.pageUrl,

                changes: request.changes,

                createdAt: new Date()
            };

            publishingStore.saveHistory(history);

            console.log(
                `Publishing completed for site: ${request.siteId}`
            );

            return result;

        } catch (error) {

            console.error(
                "Publishing failed:",
                error
            );

            const result: PublishingResult = {

                siteId: request.siteId,

                pageUrl: request.pageUrl,

                status: "failed",

                changes: request.changes.map(
                    change => ({
                        pageId: change.pageId,
                        type: change.type,
                        status: "failed",
                        message: "Failed to apply change"
                    })
                )
            };

            publishingStore.saveResult(result);

            return result;
        }
    }

    async rollback(
        historyId: string
    ): Promise<RollbackResult> {

        const history =
            publishingStore.getHistory(historyId);

        if (!history) {

            return {
                historyId,
                siteId: "",
                status: "failed",
                message: "History not found"
            };
        }

        try {

            const rollbackChanges =
                history.changes.map(
                    change => ({
                        ...change,

                        newValue: change.oldValue,

                        oldValue: change.newValue
                    })
                );

            await this.connector.applyChanges(
                history.pageUrl,
                rollbackChanges
            );

            return {

                historyId,

                siteId: history.siteId,

                status: "rolled_back",

                message:
                    "Previous version restored successfully"
            };

        } catch (error) {

            console.error(
                "Rollback failed:",
                error
            );

            return {

                historyId,

                siteId: history.siteId,

                status: "failed",

                message:
                    "Failed to rollback changes"
            };
        }
    }

    getChangelog(
        siteId: string
    ): PublishingHistory[] {

        return publishingStore.getSiteHistory(
            siteId
        );
    }

    private generateHistoryId(): string {

        return (
            Date.now().toString() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );
    }
}