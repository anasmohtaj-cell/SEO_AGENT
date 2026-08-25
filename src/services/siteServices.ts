 interface Site {
    id : string ;
    url : string ;
 }

 class SiteService {
    getSite(siteId : string):Site{
        return {
            id : siteId ,
            url : "https://example.com"

        };
    }
 }

 export default SiteService ;
