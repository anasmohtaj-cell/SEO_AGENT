import { Router } from "express";

import {
    applyChanges,
    rollback,
    getChangelog
} from "@/controllers/publishingController";

const router = Router();

router.post("/apply", applyChanges);

router.post("/rollback/:historyId", rollback);

router.get("/changelog/:siteId", getChangelog);

export default router;