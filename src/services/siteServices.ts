interface Site {
    id: string;
    url: string;
}

class SiteService {

    private pagesBySite = new Map<string, string[]>();

    getSite(siteId: string): Site {
        return {
            id: siteId,
            url: "https://example.com"
        };
    }

    saveSitePages(siteId: string, pages: string[]): void {
        this.pagesBySite.set(siteId, pages);
    }

    getSitePages(siteId: string): string[] {
        return this.pagesBySite.get(siteId) ?? [];
    }
}

export default SiteService;

