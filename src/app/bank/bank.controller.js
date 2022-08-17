import { validationResult } from "express-validator";
import { faker } from "@faker-js/faker";
import BaseError, {
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
import { GetRandom } from "../../helpers/index.helper.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    const banks = await findAllBank();
    res.render("bank/v_bank", {
      title: "Bank",
      path: "/bank",
      flashdata: flashdata,
      errors: errors,
      banks: banks,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewPutBank = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];

    const bank = await findBankById(req.params.id);
    res.render("bank/v_edit_bank", {
      title: "Edit Bank",
      path: "/bank",
      flashdata: flashdata,
      errors: errors,
      bank: bank,
      params: req.params.id,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postBank = async (req, res, next) => {
  try {
    const result = await createBank({
      account_name: "PT. Store GG Indonesia",
      bank_name: GetRandom(["Mandiri", "BRI", "BNI", "BCA"]),
      no_rekening: faker.finance.account(10),
    });

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil membuat bank baru ",
    });
    req.flash("flashdata", {
      type: "info",
      title: "Note!",
      message:
        "Jika ingin membatalkan silahkan klik tombol batal dan hapus untuk membatalkan pembuatan Bank baru ",
    });
    res.redirect(`/bank-edit/${result.bank_id}`);
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "error",
      title: "Oppps",
      message: "Gagal membuat Bank",
    });
    res.redirect(`/bank?action_error=true`);
  }
};

export const putBank = async (req, res, next) => {
  const ID = req.params.id;
  const { name, bankName, noRekening } = req.body;

  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // response here
    req.flash("errors", errValidate);
    res.redirect(`/bank?validation_error=true`);
    return;
  }

  try {
    const bank = await findBankById(ID);

    if (!bank) {
      throw new BaseError("NOT_FOUND", 404, "Bank tidak ditemukan", true);
    }
    // code here

    await updateBank(ID, {
      account_name: name,
      bank_name: bankName,
      no_rekening: noRekening,
    });

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil mengubah bank ",
    });
    res.redirect(`/bank?action_error=true`);
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "error",
      title: "Oppps",
      message: "Gagal mengubah Bank",
    });
    res.redirect(`/bank?action_error=true`);
  }
};

export const deleteBank = async (req, res, next) => {
  const ID = req.params.id;
  try {
    const bank = await findBankById(ID);

    if (!bank) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal menghapus Bank, karena Bank dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      res.redirect(`/bank`);
      return;
    }

    const message = `Anda telah menghapus bank`;

    await deleteBankById(ID);

    req.flash("flashdata", {
      type: "warning",
      title: "Terhapus!",
      message: message,
    });
    res.redirect("/bank");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Opps!",
      message: "Gagal menghapus Bank",
    });
    res.redirect(`/bank?action_error=true`);
  }
};
