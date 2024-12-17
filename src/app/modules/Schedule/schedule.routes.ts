import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.get("/", ScheduleController.getAllFromDB);
router.post("/", ScheduleController.insertIntoDB);

export const ScheduleRoutes = router;
