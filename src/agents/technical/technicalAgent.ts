import {
    TechnicalPageReport,
    TechnicalReport
} from "@/types/technicalReport";

import { technicalReportStore } from "@/services/technicalReportStore";

import SiteService from "@/services/siteServices";

export class TechnicalAgent {

    private siteService: SiteService;

    constructor() {
        this.siteService = new SiteService();
    }

    async auditSite(siteId: string): Promise<TechnicalReport> {

        console.log(
            `Starting technical audit for site : ${siteId}`
        );

        const site = this.siteService.getSite(siteId);

        console.log(
            `Auditing URL : ${site.url}`
        );

        const { default: lighthouse } = await import("lighthouse");

        const result = await lighthouse(site.url, {
            output: "json",
            onlyCategories: ["performance"],
        });

        if (!result) {
            throw new Error("Lighthouse audit failed");
        }

        const pageReport = this.buildPageReport(result.lhr);

        console.log(
            `Performance score : ${pageReport.performanceScore}`
        );

        console.log(
            `LCP : ${pageReport.coreWebVitals.lcp}`
        );

        console.log(
            `INP : ${pageReport.coreWebVitals.inp}`
        );

        console.log(
            `CLS : ${pageReport.coreWebVitals.cls}`
        );

        const report: TechnicalReport = {

            siteId,

            pages: [
                pageReport
            ]

        };

        technicalReportStore.save(report);

        return report;
    }

    private buildPageReport(lhr: any): TechnicalPageReport {

        const performanceScore =
            (lhr.categories.performance?.score ?? 0) * 100;

        const lcp =
            lhr.audits[
                "largest-contentful-paint"
            ]?.numericValue ?? 0;

        const cls =
            lhr.audits[
                "cumulative-layout-shift"
            ]?.numericValue ?? 0;

        const inp =
            lhr.audits[
                "interaction-to-next-paint"
            ]?.numericValue ?? 0;

        return {

            pageUrl: lhr.finalDisplayedUrl,

            performanceScore,

            coreWebVitals: {

                lcp,

                inp,

                cls

            }

        };
    }
}