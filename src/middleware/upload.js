import multer from "multer";
import { UPLOAD_PATH } from "../constants/index.constants.js";
import Upload from "../helpers/upload.helper.js";

export const uploadSingleImage =
  (folderPath = "/files") =>
  (req, res, next) => {
    const uploadSingle = new Upload({
      fieldName: "image",
      folderName: UPLOAD_PATH + folderPath,
      filename: req.body.filename,
    }).single();

    uploadSingle(req, res, function (err) {
      let file = {
        type: "success",
        message: "Upload file success",
        data: req.file,
      };
      if (err instanceof multer.MulterError) {
        file = {
          type: "error",
          message: "Failed to upload",
          data: null,
        };
        req.fileimg = file;
        next();
      } else if (err) {
        file = {
          type: "error",
          message: "Failed to upload",
          data: null,
        };
        req.fileimg = file;
        next();
      } else {
        if (req.file === undefined) {
          file = {
            type: "warning",
            message: "Please upload your file",
            data: null,
          };
        }
        req.fileimg = file;
        next();
      }
    });
  };

// export default uploadFilesMiddleware ;
