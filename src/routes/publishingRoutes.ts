import { Router } from "express" ;
import { applyChanges } from "@/controllers/publishingController";

const router = Router() ;

router.post( 
    "/publish/apply" ,
    applyChanges
);

export default router