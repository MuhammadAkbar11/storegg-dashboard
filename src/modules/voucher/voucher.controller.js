
import { validationResult } from "express-validator";
import {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import {
  createVoucher,
  deleteVoucherById,
  findAllVoucher,
  findVoucherById,
  updateVoucher,
} from "./voucher.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    res.render("voucher/v_voucher", {
      title: "voucher",
      path: "/voucher",
      flashdata: flashdata,
      errors: errors,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};


export const postVoucher = async (req, res, next) => {

  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // response here
    return;
  }

  try {
    // code here
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};


export const putVoucher = async (req, res, next) => {

  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // response here
    return;
  }

  try {
    // code here
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};


export const deleteVoucher = async (req, res, next) => {
  try {
    // code here
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};
  