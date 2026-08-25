import {Router} from "express" ;
import {runTechnicalAudit , getTechnicalReport} from "@/controllers/technicalController"


const router = Router() ;

router.post("/technical/site/:id/audit",runTechnicalAudit);

router.get("/technical/site/:id/report" , getTechnicalReport);

export default router;
