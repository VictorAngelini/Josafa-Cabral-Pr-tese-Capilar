import { Router, type IRouter } from "express";
import healthRouter from "./health";
import appointmentsRouter from "./appointments";
import servicesRouter from "./services";
import authRouter from "./auth";
import blockedSlotsRouter from "./blocked-slots";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(appointmentsRouter);
router.use(servicesRouter);
router.use(blockedSlotsRouter);

export default router;
