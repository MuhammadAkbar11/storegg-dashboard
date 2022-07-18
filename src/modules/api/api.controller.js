import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import VoucherModel from "../voucher/voucher.model.js";

export const apiGetVouchers = async (req, res, next) => {
  const limit = +req.query.result ?? null;

  try {
    const voucher = await VoucherModel.find()
      .select("_id name status category thumbnail")
      .populate("category")
      .limit(limit);

    res.status(200).json({ data: voucher });
  } catch (err) {
    next(new TransfromError(err));
  }
};
