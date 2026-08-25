export interface CoreWebVitals {
    lcp: number;
    inp: number;
    cls: number;
}

export interface TechnicalPageReport {
    pageUrl: string;
    performanceScore: number;
    coreWebVitals: CoreWebVitals;
}

export interface TechnicalReport {
    siteId: string;
    pages: TechnicalPageReport[];
}