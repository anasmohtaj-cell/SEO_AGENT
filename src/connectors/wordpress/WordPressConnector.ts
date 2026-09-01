import { CMSConnector } from "../CMSConnector";
import { PublishingChange } from "@/types/publishing";

export class WordPressConnector implements CMSConnector{

    private baseUrl: string ;
    private username: string ;
    private password: string ;

    constructor(
         baseUrl: string ,
         username: string ,
         password: string 
    ){
        this.baseUrl = baseUrl ;
        this.username = username ;
        this.password = password ;
    }

    private async updatePage(
        pageId: string ,
        data: Record<string , any>
    ): Promise<void>{

        const url = `${this.baseUrl}/wp-json/wp/v2/pages/${pageId}`;

        const credentials = Buffer.from(`${this.username}:${this.password}`).toString("base64");

        const response = await fetch(url , {
            method  : "POST",

            headers : {
                "Content-Type": "application/json" , 
                "Authorization": `Basic ${credentials}`
            },
            body : JSON.stringify(data)
        });

        if(!response.ok){
            const error = await response.text();

            throw new Error(`WordPress API error : ${response.status} ${error}`);
        }

        console.log(`WordPress page ${pageId} update successfully`);
    }

    private async updateTitle(
        pageId: string,
        newTitle: string
         ): Promise<void> {

            await this.updatePage(
            pageId,
            {
                title: newTitle
            }
        );
    }

    private async updateDescriptoin(
        pageId : string ,
        newDescription : string
    ): Promise<void>{

        await this.updatePage( pageId ,
            {
                excerpt : newDescription
            }
        )
    }
    
    private async updateContent(
        pageId: string ,
        newContent : string
    ): Promise<void>{
        
        await this.updatePage(pageId ,
            {
                content: newContent
            }
        );
    }


    async applyChanges(pageUrl : string , changes: PublishingChange[]): Promise<void> {

        console.log(`Publishing changes to WordPress page : ${pageUrl}`);

        for(const change of changes){
            console.log(`Applying ${change.type} change...`);

            switch (change.type){
                case "title":
                    await this.updateTitle(
                        change.pageId,
                        change.newValue
                    );
                    break;

                case "content" :
                    await this.updateContent(
                        change.pageId ,
                        change.newValue
                    );
                    break ;
                
                case "description" :
                    await this.updateDescriptoin(
                        change.pageId ,
                        change.newValue
                    );
                    break ;

                default : 
                      console.log(`Chnge type ${change.type} is not implimented yet`);
                
            }
        }

    }

     
}