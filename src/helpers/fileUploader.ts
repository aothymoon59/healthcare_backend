import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      //   {
      //     public_id: file.originalname.split(".")[0] + "_" + Date.now(),
      //     // TODO: if needed to reduce file size
      //     transformation: [{ crop: "limit" }],
      //   },
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
