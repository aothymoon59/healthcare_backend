import express from "express";
import { MetaController } from "./meta.controller";

const router = express.Router();

router.get("/", MetaController.fetchDashboardMetaData);

export const MetaRoutes = router;
