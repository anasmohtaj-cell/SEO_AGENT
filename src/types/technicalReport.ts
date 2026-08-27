export interface CoreWebVitals {
    lcp: number;
    inp: number;
    cls: number;
}

export interface TechnicalPageReport {
    pageUrl: string;
    performanceScore: number;
    seoScore : number ;
    coreWebVitals: CoreWebVitals;
    javascriptSize : number ;
    cssSize: number ;
    imageCount : number ;
    cacheEnabled : boolean;
}

export interface TechnicalReport {
    siteId: string;
    pages: TechnicalPageReport[];

    summary : {
        averagePerformanceScore : number ;
        averageSeoScore : number ;
        averageLcp : number ;
        averageInp : number ;
        averageCls : number ;
        totalJavaScriptSize : number ;
        totalCssSize : number ;
        totalImages : number ;
    };
}