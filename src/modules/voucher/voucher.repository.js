import { TransfromError } from "../../helpers/baseError.helper.js";
import { deleteFile } from "../../utils/index.js";
import sharp from "sharp";
import VoucherModel from "./voucher.model.js";
import path from "path";
import { MODE, UPLOAD_PATH } from "../../config/env.config.js";
import { DEV_STATIC_FOLDER, STATIC_FOLDER } from "../../utils/constants.js";

export const findAllVoucher = async () => {
  try {
    const result = await VoucherModel.find({})
      .populate("category")
      .populate("nominals");
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllVoucher", error);
    throw new TransfromError(error);
  }
};

export const findVoucherById = async id => {
  try {
    const result = await VoucherModel.findById(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneVoucher", error);
    throw new TransfromError(error);
  }
};

export const createVoucher = async data => {
  try {
    const result = await VoucherModel.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createVoucher", error);
    throw new TransfromError(error);
  }
};

export const updateVoucher = async (id, data) => {
  try {
    const result = await VoucherModel.findById(id);

    const oldThumbnail = result.thumbnail;
    const fileImgData = data.fileimg.data;
    if (fileImgData) {
      const resultImg = "GG_" + fileImgData.filename;
      await sharp(fileImgData.path)
        .resize(281, 381)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(fileImgData.destination, resultImg));
      deleteFile(fileImgData.path);
      result.thumbnail = `/uploads/vouchers/${resultImg}`;

      if ("/uploads/Default-Thumbnail.png" != oldThumbnail) {
        const oldThumbnailPath =
          MODE == "development" ? ".dev/public" : "public";
        console.log(
          "/uploads/Default-Thumbnail.png" != oldThumbnail,

          oldThumbnailPath,
          oldThumbnail
        );
        deleteFile(oldThumbnailPath + oldThumbnail);
      }
    }

    result.name = data.name;
    result.category = data.category;
    result.gameCoinName = data.gameCoinName;
    result.nominals = data.nominals;

    return await result.save();
  } catch (error) {
    console.error("[EXCEPTION] updateVoucher", error);
    throw new TransfromError(error);
  }
};

export const deleteVoucherById = async id => {
  try {
    const result = await VoucherModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteVoucherById", error);
    throw new TransfromError(error);
  }
};
