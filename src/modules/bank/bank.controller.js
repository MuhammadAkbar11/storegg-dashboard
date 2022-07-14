import { validationResult } from "express-validator";
import {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import {
  createBank,
  deleteBankById,
  findAllBank,
  findBankById,
  updateBank,
} from "./bank.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    res.render("bank/v_bank", {
      title: "bank",
      path: "/bank",
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

export const postBank = async (req, res, next) => {
  const { name, bankName, noRekening } = req.body;
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // response here
    req.flash("errors", errValidate);
    res.redirect(`${redirect}?validation_error=true`);
    return;
  }

  try {
    await createBank({
      name,
      bankName,
      noRekening,
    });

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil menambahkan bank",
    });
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};

export const putBank = async (req, res, next) => {
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

export const deleteBank = async (req, res, next) => {
  try {
    // code here
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};
