import { validationResult } from "express-validator";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import { getRandom } from "../../utils/index.js";
import { findAllBank } from "../bank/bank.repository.js";
import {
  createPayment,
  deletePaymentById,
  findAllPayment,
  findPaymentById,
  updatePayment,
} from "./payment.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    const payments = await findAllPayment();
    res.render("payment/v_payment", {
      title: "Metode Pembayaran",
      path: "/payment",
      flashdata: flashdata,
      payments: payments,
      errors: errors,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewPutPayment = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];

    const payment = await findPaymentById(req.params.id);
    let banks = await findAllBank();

    banks = banks.map(bank => {
      const data = bank._doc;
      let checked = null;
      payment.banks.map(pyBnk => {
        if (pyBnk._id.toString() === data._id.toString()) {
          checked = "checked";
        }
      });
      return {
        ...data,
        checked: checked,
      };
    });

    res.render("payment/v_edit_payment", {
      title: "Edit Metode Pembayaran",
      path: "/payment",
      flashdata: flashdata,
      errors: errors,
      payment: payment,
      banks: banks,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postPayment = async (req, res, next) => {
  try {
    const banks = await findAllBank();
    const bank1 = getRandom(banks);

    const newPaymentData = {
      type: "Transfer",
      status: "N",
      banks: [bank1._id],
    };

    const result = await createPayment(newPaymentData);

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil membuat metode pembayaran baru",
    });
    req.flash("flashdata", {
      type: "info",
      title: "Note!",
      message:
        "Jika ingin membatalkan silahkan klik tombol batal dan hapus untuk membatalkan pembuatan Voucher baru ",
    });
    res.redirect(`/payment-edit/${result._id}`);
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Oppps",
      message: "Gagal membuat metode pembayaran",
    });
    res.redirect("/payment?action_error=true");
  }
};

export const putPayment = async (req, res, next) => {
  const ID = req.params.id;
  const { type, banks } = req.body;
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    req.flash("errors", errValidate);
    res.redirect(`/payment-edit/${ID}?validation_error=true`);
    return;
  }

  try {
    const payment = await findPaymentById(ID);

    if (!payment) {
      throw new BaseError("NOT_FOUND", 404, "payment tidak ditemukan", true);
    }
    console.log(req.body);
    const updatedPaymentData = {
      type: type,
      banks: banks,
    };

    await updatePayment(ID, updatedPaymentData);

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil membuat metode pembayaran baru",
    });
    res.redirect("/payment");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Oppps",
      message: "Gagal mengubah metode pembayaran",
    });
    res.redirect("/payment?action_error=true");
  }
};

export const deletePayment = async (req, res, next) => {
  const ID = req.params.id;

  try {
    const payment = await findPaymentById(ID);

    if (!payment) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal menghapus Metode Pembayaran, karena Metode Pembayaran dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      res.redirect(`/payment`);
      return;
    }

    await deletePaymentById(ID);

    const message = `Anda telah menghapus metode pembayaran ${payment.type} `;

    req.flash("flashdata", {
      type: "warning",
      title: "Terhapus!",
      message: message,
    });
    res.redirect("/payment");
    // Response Success
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Oppps",
      message: "Gagal menghapus metode pembayaran",
    });
    res.redirect("/payment?action_error=true");
  }
};
