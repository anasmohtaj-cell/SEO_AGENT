import { Request, Response } from "express";

import {
    PublishingAgent
} from "@/agents/publishing/PublishingAgent";

import {
    WordPressConnector
} from "@/connectors/wordpress/WordPressConnector";

import { MockCMSConnector }
from "@/connectors/MockCMSConnector";

const mockConnector =
    new MockCMSConnector();

const publishingAgent =
    new PublishingAgent(
        mockConnector
    );


// ==============================
// APPLY CHANGES
// ==============================

export const applyChanges = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            siteId,
            pageUrl,
            changes
        } = req.body;


        if (!siteId) {

            return res.status(400).json({
                error: "siteId is required"
            });

        }


        if (!pageUrl) {

            return res.status(400).json({
                error: "pageUrl is required"
            });

        }


        if (!Array.isArray(changes)) {

            return res.status(400).json({
                error: "changes must be an array"
            });

        }


        console.log(
            `Publishing request for site : ${siteId}`
        );


        const result =
            await publishingAgent.applyChanges({

                siteId,

                pageUrl,

                changes

            });


        return res.status(200).json(result);

    } catch (error) {

    console.error(
        "Publishing error:",
        error
    );

    return res.status(500).json({
        error: error instanceof Error
            ? error.message
            : "Unknown error"
    });
}
};


// ==============================
// ROLLBACK
// ==============================

export const rollback = async (
    req: Request,
    res: Response
) => {

    try {

        const historyId = String(req.params.historyId);

 
 
        if (!historyId) {

            return res.status(400).json({
                error: "historyId is required"
            });

        }


        console.log(
            `Rollback request for history: ${historyId}`
        );


        const result =
            await publishingAgent.rollback(
                historyId
            );


        if (result.status === "failed") {

            return res.status(404).json(result);

        }


        return res.status(200).json(result);

    } catch (error) {

        console.error(
            "Rollback error:",
            error
        );

        return res.status(500).json({
            error: "Failed to rollback changes"
        });

    }
};


// ==============================
// CHANGELOG
// ==============================

export const getChangelog = async (
    req: Request,
    res: Response
) => {

    try {

         const siteId = String(req.params.siteId)

        if (!siteId) {

            return res.status(400).json({
                error: "siteId is required"
            });

        }


        const changelog =
            publishingAgent.getChangelog(
                siteId
            );


        return res.status(200).json(
            changelog
        );

    } catch (error) {

        console.error(
            "Changelog error:",
            error
        );

        return res.status(500).json({
            error: "Failed to get changelog"
        });

    }
};