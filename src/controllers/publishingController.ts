import {  Request , Response } from "express" ;
import {PublishingAgent} from "@/agents/publishing/PublishingAgent";
 

const publishingAgent = new PublishingAgent();

export const applyChanges = async (
    req : Request ,
    res : Response
) => {

    try {

       const { siteId, changes } = req.body;

       if (!siteId){
        return res.status(400).json({
            error: "siteId is required"
        });
       }

       if(!Array.isArray(changes)){
        return res.status(400).json({
            error: "changes must be an array"
        });
       }

       console.log(`Publishing request for site : ${siteId}`);

       const result = await publishingAgent.applyChanges({
        siteId ,
        changes
       })
        
       return res.status(200).json(result);

} catch (error){
    
    console.error( "Publishing error " , error);

    return res.status(500).json({
        error: "Failed to apply changes"
    });
}
};
