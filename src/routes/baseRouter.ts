import {  baseSubRoutes } from "@Constants/routeConstants";
import baseController from "@Controller/baseController";
import { Router } from "express";
// import { Log } from "index";

const router = Router();
router.get(baseSubRoutes.printLogs, baseController.printBasicLogs);

router.post('/insights',baseController.getInsights);
// router.post(baseAPIRoute, async (req, res, next) => {
//     console.log("Route handler for POST /api/v1 called");
//     try {
//         const insights = await baseController.getInsights(req, res);
//         res.json(insights);
//     } catch (error) {
//         next(error);
//     }
// });

export default router;
