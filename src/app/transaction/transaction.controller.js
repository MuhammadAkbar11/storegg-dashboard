// import { validationResult } from "express-validator";
import dayjs from "dayjs";
import { httpStatusCodes } from "../../constants/index.constants.js";
import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import { Rupiah, ToPlainObject } from "../../helpers/index.helper.js";
import {
  // createTransaction,
  // deleteTransactionById,
  findAllTransaction,
  findTransactionById,
  updateTransactionHistoryPayment,
  // updateTransaction,
  updateTransactionStatusById,
} from "./transaction.repository.js";
import { findAllPayment } from "../payment/payment.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    let transactions = await findAllTransaction({
      where: {},
      order: [["transaction_id", "ASC"]],
    });

    transactions = ToPlainObject(transactions);
    transactions.map(tr => {
      tr.created_at = dayjs(tr.created_at).format("DD MMM YYYY");
      return { ...tr };
    });

    res.render("transaction/v_transaction", {
      title: "Transaksi",
      path: "/transaction",
      flashdata: flashdata,
      transactions: transactions,
      errors: errors,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewGetInvoice = async (req, res, next) => {
  const invoiceId = req.params.id;
  try {
    let invoice = await findTransactionById(invoiceId);
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];

    if (!invoice) {
      throw new BaseError(
        "NOT_FOUND",
        httpStatusCodes.NOT_FOUND,
        "invoice tidak ditemukan",
        true,
        {
          errorView: "errors/404",
          renderData: {
            title: "Page Not Found",
          },
          responseType: "page",
        }
      );
    }

    invoice = ToPlainObject(invoice);
    invoice.due_date = dayjs(invoice.created_at)
      .add(3, "day")
      .format("DD/MM/YYYY");
    invoice.created_at = dayjs(invoice.created_at).format("DD/MM/YYYY");
    invoice.value_num = invoice.value;
    invoice.subtotal = Rupiah(invoice.value - invoice.tax);
    invoice.value = Rupiah(invoice.value);
    invoice.tax = Rupiah(invoice.tax);
    invoice.history.history_voucher.price = Rupiah(
      invoice?.history?.history_voucher?.price
    );

    if (invoice.history.history_payment.payer) {
      const payer = JSON.parse(invoice.history.history_payment.payer);
      invoice.history.history_payment.payer = payer;
      invoice.history.history_payment.payer.pay_date = dayjs(
        payer.pay_date
      ).format("DD/MM/YYYY");
    }

    const payments = await findAllPayment();

    res.render("transaction/v_invoice", {
      title: "Invoice " + invoice.transaction_id,
      path: "/transaction",
      flashdata: flashdata,
      invoice: invoice,
      errors: errors,
      payments,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewGetPrintInvoice = async (req, res, next) => {
  const invoiceId = req.params.id;
  try {
    let invoice = await findTransactionById(invoiceId);
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];

    if (!invoice) {
      throw new BaseError(
        "NOT_FOUND",
        httpStatusCodes.NOT_FOUND,
        "invoice tidak ditemukan",
        true,
        {
          errorView: "errors/404",
          renderData: {
            title: "Page Not Found",
          },
          responseType: "page",
        }
      );
    }

    invoice = ToPlainObject(invoice);
    invoice.due_date = dayjs(invoice.created_at)
      .add(3, "day")
      .format("DD/MM/YYYY");
    invoice.created_at = dayjs(invoice.created_at).format("DD/MM/YYYY");
    invoice.value_num = invoice.value;
    invoice.subtotal = Rupiah(invoice.value - invoice.tax);
    invoice.value = Rupiah(invoice.value);
    invoice.tax = Rupiah(invoice.tax);
    invoice.history.history_voucher.price = Rupiah(
      invoice?.history?.history_voucher?.price
    );

    if (invoice.history.history_payment.payer) {
      const payer = JSON.parse(invoice.history.history_payment.payer);
      invoice.history.history_payment.payer = payer;
      invoice.history.history_payment.payer.pay_date = dayjs(
        payer.pay_date
      ).format("DD/MM/YYYY");
    }

    res.render("transaction/v_invoice_print", {
      title: "Invoice " + invoice.transaction_id,
      path: "/transaction",
      flashdata: flashdata,
      invoice: invoice,
      errors: errors,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const updateTransactionStatus = async (req, res, next) => {
  const ID = req.params.id;
  const { status } = req.body;
  const statusTypes = {
    failed: "Membatalkan",
    success: "Menerima",
  };

  try {
    const transaction = await findTransactionById(ID);

    if (!transaction) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal ${statusTypes[status]} Transaksi, karena Transaksi dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      res.redirect(`/transaction?action_error=true`);
      return;
    }

    // if(transaction)
    if (status.includes("failed") && transaction.is_paid) {
      req.flash("flashdata", {
        type: "error",
        title: "Opps!",
        message: `Gagal ${statusTypes[status]} Transaksi, dikarenakan Transaksi <strong>#${ID}</strong> telah dibayar dan tidak dapat dibatalkan!`,
      });
      return res.redirect(`/transaction?action_error=true`);
    }

    const message = `Berhasil ${statusTypes[status]} Transaksi`;

    await updateTransactionStatusById(ID, status);

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: message,
    });
    res.redirect("back");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Oppps!",
      message: `Gagal ${statusTypes[status]} Transaksi `,
    });
    res.redirect(`/transaction?action_error=true`);
  }
};

export const updateTransactionPayment = async (req, res, next) => {
  // const ID = req.body.transaction_id;
  const {
    value,
    pay_date,
    payment_method,
    bank_account_name,
    bank_name,
    no_bank_account,
    payment_note,
    transaction_id: ID,
  } = req.body;

  const redirect = "invoice/" + ID;

  try {
    let transaction = await findTransactionById(ID);

    if (!transaction) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal mengupdate pembayaran, karena Transaksi dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      return res.redirect(`/${redirect}?action_error=true`);
    }

    transaction = ToPlainObject(transaction);

    const { history_payment: historyPayment } = transaction.history;

    const transactionPaymentMethod = historyPayment.type;
    const transactionHistoryPayID = historyPayment.history_payment_id;
    if (!payment_method.includes(transactionPaymentMethod)) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal mengupdate pembayaran, metode pembayaran berbeda!`,
      });
      return res.redirect(`/${redirect}?action_error=true`);
    }

    const message = `Konfirmasi pembayaran berhasil!`;

    await updateTransactionHistoryPayment(ID, transactionHistoryPayID, {
      value: value,
      pay_date: pay_date,
      bank_account_name: bank_account_name,
      bank_name: bank_name ?? "-",
      no_bank_account: no_bank_account ?? "-",
      payment_note: payment_note ?? "-",
    });

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: message,
    });

    res.redirect("/" + redirect);
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Oppps!",
      message: `Gagal mengupdate pembayaran `,
    });
    res.redirect(`/${redirect}?action_error=true`);
  }
};
