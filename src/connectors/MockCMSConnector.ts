import { PublishingChange } from "@/types/publishing";
import { CMSConnector } from "@/connectors/CMSConnector";

export class MockCMSConnector implements CMSConnector {

    async applyChanges(
        pageUrl: string,
        changes: PublishingChange[]
    ): Promise<void> {

        console.log(
            `MOCK: Publishing changes to ${pageUrl}`
        );

        for (const change of changes) {

            console.log(
                `${change.type}: "${change.oldValue}" → "${change.newValue}"`
            );
        }

        console.log(
            "MOCK: Changes applied successfully"
        );
    }
}