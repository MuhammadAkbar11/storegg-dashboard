import path from "path";
import multer from "multer";
import dayjs from "dayjs";
import BaseError from "./baseError.helper.js";

class Upload {
  constructor({
    fieldName = "image",
    folderName = "public/uploads/",
    fileTypes = /jpg|jpeg|png/,
  }) {
    this.fieldName = fieldName;
    this.folderName = folderName;
    this.fileTypes = fileTypes;
  }

  diskStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.folderName);
      },
      filename: (req, file, cb) => {
        let filename = req.body.filename;

        if (!filename) {
          filename = file.fieldname;
        }

        const resultFileName = filename
          .replace(/[^A-Za-z0-9]/g, "")
          .replace(/\s+/g, "")
          .trim();
        const filenameToArr = file.originalname.split(" ").join("").split(".");
        const ext = filenameToArr[filenameToArr.length - 1];
        cb(null, `${resultFileName}_${dayjs().valueOf()}.${ext}`);
      },
    });
  }

  checkFileType(file, cb) {
    const extname = this.fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = this.fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new BaseError("Multer", 500, "Images Only", true));
    }
  }

  single() {
    const storage = this.diskStorage();
    return multer({
      storage,
      fileFilter: (req, file, cb) => {
        this.checkFileType(file, cb);
      },
    }).single(this.fieldName);
  }
}

export default Upload;
