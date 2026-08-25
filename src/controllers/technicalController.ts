import { Request, Response } from "express";
import { TechnicalAgent } from "@/agents/technical/technicalAgent";
import {technicalReportStore} from "@/services/technicalReportStore"

const technicalAgent = new TechnicalAgent();

export const runTechnicalAudit = async (
    req: Request,
    res: Response
) => {
    try {
        const siteId = String(req.params.id);

        const jobId = `technical-${siteId}-${Date.now()}`;

        technicalAgent.auditSite(siteId)
            .then(() => {
                console.log(`Technical audit termine : ${jobId}`);
            })
            .catch((error) => {
                console.error(`Erreur audit ${jobId}:`, error);
            });

        res.status(202).json({
            jobId,
            status: "started"
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors du lancement de l'audit technique"
        });
    }
};

export const getTechnicalReport = (
    req : Request ,
    res : Response 
)=> {
    const siteId = String(req.params.id);

    const report = technicalReportStore.get(siteId);

    if (!report){
        return res.status(404).json({
            messsage : "Technical report not found"
        });
    }
    return res.status(200).json(report);
}