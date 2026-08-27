import {
    TechnicalPageReport,
    TechnicalReport
} from "@/types/technicalReport";

import { technicalReportStore } from "@/services/technicalReportStore";

import SiteService from "@/services/siteServices";

import { crawlAgent } from "@/services/crawlAgentStore";

export class TechnicalAgent {

    private siteService: SiteService;

    constructor() {
        this.siteService = new SiteService();
    }

    async auditSite(siteId: string): Promise<TechnicalReport> {

    console.log(
        `Starting technical audit for site : ${siteId}`
    );

    // 1. Récupérer les pages du site
    const pages = crawlAgent.getPages(siteId);

    // 2. Tableau qui va contenir les rapports de chaque page
    const pageReports: TechnicalPageReport[] = [];

    // 3. Import dynamique de Lighthouse
    const { default: lighthouse } = await import("lighthouse");


    // 4. Auditer chaque page
    for (const pageUrl of pages) {

        console.log(
            `Auditing URL : ${pageUrl}`
        );

        try {
             const result = await lighthouse(pageUrl, {
             output: "json",
             onlyCategories: [
             "performance",
             "seo"
             ]
            });
             


            // Lighthouse n'a pas retourné de résultat
            if (!result) {

                console.error(
                    `Lighthouse failed for ${pageUrl}`
                );

                continue;
            }


            // 5. Transformer le résultat Lighthouse
            // en TechnicalPageReport
            const pageReport =
                this.buildPageReport(result.lhr);


            // 6. Ajouter le rapport au tableau
            pageReports.push(pageReport);


            // 7. Afficher les résultats dans le terminal
            console.log(
                `Performance score : ${pageReport.performanceScore}`
            );

            console.log(`SEO score : ${pageReport.seoScore}`)

            console.log(
                `LCP : ${pageReport.coreWebVitals.lcp}`
            );

            console.log(
                `INP : ${pageReport.coreWebVitals.inp}`
            );

            console.log(
                `CLS : ${pageReport.coreWebVitals.cls}`
            );


        } catch (error) {

            console.error(
                `Erreur lors de l'audit de ${pageUrl}:`,
                error
            );

            // On continue avec les autres pages
            continue;
        }
    }


    // 8. Calculer le résumé global
    // IMPORTANT : pageReports et pas pages
    const summary = this.buildSummary(
        pageReports
    );


    // 9. Construire le rapport final
    const report: TechnicalReport = {

        siteId,

        pages: pageReports,

        summary

    };


    // 10. Sauvegarder le rapport
    technicalReportStore.save(report);


    // 11. Retourner le rapport
    return report;
}
    
    private buildPageReport(lhr: any): TechnicalPageReport {

        const performanceScore =
            (lhr.categories.performance?.score ?? 0) * 100;

        const seoScore = (lhr.categories.seo?.score?? 0)*100 ;

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

        const resources = lhr.audits["network-requests"]?.details?.items ?? [] ;

        const javascriptSize = resources.filter((item : any) => item.resourceType === "Script")
                                        .reduce(
                                            (total : number , item : any)=> total + (item.transferSize ?? 0),0
                                        );

        const cssSize = resources.filter((item : any) => item.resourceType === "Stylesheet")
                                        .reduce(
                                            (total : number , item : any)=> total + (item.transferSize ?? 0),0
                                        );

        const imageCount = resources.filter((item : any) => item.resourceType === " Image").length;
                                 

        const cacheEnabled = lhr.audits["uses-log-cache-ttl"]?.score === 1 ;
    

        return {

            pageUrl: lhr.finalDisplayedUrl,

            performanceScore,

            seoScore,
            
            coreWebVitals: {

                lcp,

                inp,

                cls

            },

            javascriptSize ,

            cssSize ,

            imageCount ,

            cacheEnabled
        };
    }

    private buildSummary(
        pages : TechnicalPageReport[]
    ){
        const pagesCount = pages.length ;

        if (pagesCount === 0){
            return {
                averagePerformanceScore : 0 ,
                averageSeoScore : 0 ,
                averageLcp : 0 ,
                averageInp : 0 ,
                averageCls : 0 ,
                totalJavaScriptSize : 0 ,
                totalCssSize : 0 ,
                totalImages : 0
            };
        }

        const averagePerformanceScore = pages.reduce(
            (total , page) => total + page.performanceScore, 0
        )/ pagesCount ;

        const averageSeoScore = pages.reduce((total , page)=>total + page.seoScore , 0)/pagesCount;

        const averageLcp =
        pages.reduce(
            (total, page) =>
                total + page.coreWebVitals.lcp,
            0
        ) / pagesCount;

        const averageCls = pages.reduce(
            (total , page)=> total + page.coreWebVitals.cls , 0
        );

        const averageInp = pages.reduce(
            (total , page)=> total + page.coreWebVitals.inp ,0
        );

        const totalJavaScriptSize= pages.reduce(
            (total , page)=> total + page.javascriptSize ,0
        );

         
        const totalCssSize =  pages.reduce((total , page)=> total + page.cssSize, 0) ;

        const totalImages = pages.reduce((total , page)=> total + page.imageCount , 0);

        return {
            averagePerformanceScore ,
            averageSeoScore ,
            averageLcp ,
            averageInp ,
            averageCls ,
            totalJavaScriptSize ,
            totalCssSize ,
            totalImages

        }

    }
}