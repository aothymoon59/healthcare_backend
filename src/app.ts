import { AppointmentServices } from "./app/modules/Appointment/appointment.service";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import cron from "node-cron";

const app: Application = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("* * * * *", () => {
  try {
    AppointmentServices.cancelUnpaidAppointments();
  } catch (err) {
    console.error(err);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "PH HealthCare Server...",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found",
    },
  });
});

export default app;
