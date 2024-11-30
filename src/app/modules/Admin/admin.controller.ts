import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { pick } from "../../../shared/pick";

const getAllFromDB = async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "name",
    "email",
    "searchTerm",
    "contactNumber",
  ]);
  const result = await AdminService.getAllFromDB(filters);

  try {
    res.status(200).json({
      success: true,
      message: "Admin data fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};

export const AdminController = {
  getAllFromDB,
};
