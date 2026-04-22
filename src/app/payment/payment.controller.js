import { validationResult } from "express-validator";
import MySQLConnection from "../../config/db.config.js";
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
  updatePaymentStatusById,
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
      const data = bank.dataValues;
      let checked = null;
      payment.banks.map(pyBnk => {
        if (pyBnk.bank_id === data.bank_id) {
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
    const banks = await findAllBank({ where: {} });
    const selectedBank = getRandom(banks);

    const newPaymentData = {
      type: "Transfer",
      status: "N",
    };

    const result = await createPayment(newPaymentData, selectedBank);

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
    res.redirect(`/payment-edit/${result.payment_method_id}`);
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

    const oldBanks = payment.banks;

    const updatedBanks = await findAllBank({
      where: {
        bank_id: banks,
      },
    });

    const updatedPaymentData = {
      type: type,
      oldBanks,
      newBanks: updatedBanks,
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

    const message = `Anda telah menghapus metode pembayaran <span class="text-warning" >${payment.type}</span> `;

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

export const updatePaymentStatus = async (req, res, next) => {
  const ID = req.params.id;
  const status = req.body.status === "Y" ? "Menonaktifkan" : "Mengaktifkan";

  try {
    const payment = await findPaymentById(ID);

    if (!payment) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal ${status} Metode Pembayaran, karena Metode Pembayaran dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      res.redirect(`/payment`);
      return;
    }

    const message = `Berhasil ${status} Metode Pembayaran <strong class="text-success" >${payment.type}</strong> `;

    await updatePaymentStatusById(ID);

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: message,
    });
    res.redirect("/payment");
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "error",
      title: "Oppps!",
      message: `Gagal ${status} Metode Pembayaran `,
    });
    res.redirect(`/payment?action_error=true`);
  }
};
