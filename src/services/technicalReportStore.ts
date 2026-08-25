import {TechnicalReport} from "@/types/technicalReport"

class TechnicalReportStore {
 private reports = new Map <string , TechnicalReport>();

 save(report: TechnicalReport): void {
    this.reports.set(report.siteId , report);
 }

 get(siteId : string): TechnicalReport | undefined { 
    return this.reports.get(siteId);
 }
}


export const technicalReportStore = new TechnicalReportStore();