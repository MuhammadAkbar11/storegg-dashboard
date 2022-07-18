import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import { findAllCategories } from "../category/category.repository.js";
import VoucherModel from "../voucher/voucher.model.js";

export const apiGetVouchers = async (req, res, next) => {
  const limit = +req.query.result ?? null;

  try {
    const voucher = await VoucherModel.find()
      .select("_id name status category thumbnail")
      .populate("category")
      .limit(limit);

    res
      .status(200)
      .json({ message: "Berhasil mengambil data voucher", data: voucher });
  } catch (err) {
    next(new TransfromError(err));
  }
};

export const apiGetDetailVoucher = async (req, res, next) => {
  try {
    const { ID } = req.params;
    const voucher = await VoucherModel.findOne({ _id: ID })
      .populate("category")
      .populate("nominals")
      .populate("user", "_id name phoneNumber");

    if (!voucher) {
      throw new BaseError(
        "NOT_FOUND",
        404,
        "Voucher game tidak ditemukan.!",
        true
      );
    }

    res.status(200).json({
      message: "Berhasil mengambil detail data voucher",
      data: voucher,
    });
  } catch (err) {
    next(new TransfromError(err));
  }
};

export const apiGetCategories = async (req, res, next) => {
  try {
    const category = await findAllCategories({});
    res.status(200).json({ data: category });
  } catch (err) {
    next(new TransfromError(err));
  }
};
