import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import httpStatusCodes from "../../utils/httpStatusCode.js";
import { findBankById } from "../bank/bank.repository.js";
import { findAllCategories } from "../category/category.repository.js";
import { findNominalById } from "../nominal/nominal.repository.js";
import { findPaymentById } from "../payment/payment.repository.js";
import { findPlayerById } from "../player/player.repository.js";
import { createTransaction } from "../transaction/transaction.repository.js";
import VoucherModel from "../voucher/voucher.model.js";
import { findOneVoucher } from "../voucher/voucher.repository.js";

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

export const apiPostCheckout = async (req, res, next) => {
  const { accountUser, name, nominal, voucher, payment, bank } = req.body;
  try {
    const resVoucher = await findOneVoucher({ _id: voucher });

    if (!resVoucher) {
      throw new BaseError(
        "NOT_FOUND",
        httpStatusCodes.NOT_FOUND,
        "Voucher game tidak ditemukan.",
        true
      );
    }

    const resNominal = await findNominalById(nominal);

    if (!resNominal) {
      throw new BaseError(
        "NOT_FOUND",
        httpStatusCodes.NOT_FOUND,
        "Nominal tidak ditemukan.",
        true
      );
    }

    const resPayment = await findPaymentById(payment);

    if (!resPayment) {
      throw new BaseError(
        "NOT_FOUND",
        httpStatusCodes.NOT_FOUND,
        "Metode pembayaran tidak ditemukan.",
        true
      );
    }

    const resBank = await findBankById(bank);

    if (!resBank) {
      throw new BaseError(
        "NOT_FOUND",
        httpStatusCodes.NOT_FOUND,
        "Metode pembayaran tidak ditemukan.",
        true
      );
    }

    const player = await findPlayerById(req.player._id);

    let tax = (10 / 100) * resNominal._doc.price;
    let value = resNominal._doc.price + tax;

    console.log("[ResPayment] >>", resPayment);

    const payload = {
      historyVoucherTopup: {
        gameName: resVoucher._doc.name,
        category: resVoucher._doc.category ? resVoucher._doc.category.name : "",
        thumbnail: resVoucher._doc.thumbnail,
        coinName: resNominal._doc.coinName,
        coinQuantity: resNominal._doc.coinNominal,
        price: resNominal._doc.price,
      },
      historyPayment: {
        name: resBank._doc.name,
        type: resPayment._doc.type,
        bankName: resBank._doc.bankName,
        noRekening: resBank._doc.noRekening,
      },
      name: name,
      accountUser: accountUser,
      tax: tax,
      value: value,
      player: player._id,
      historyPlayer: {
        name: player?.name,
        email: player?.email,
        phoneNumber: player?.phoneNumber,
      },
      category: resVoucher._doc.category?._id,
      user: resVoucher._doc.user?._id,
    };

    const result = await createTransaction(payload);

    res.status(200).json({
      message: "Checkout Berhasil",
      data: result,
    });
  } catch (error) {
    next(new TransfromError(error));
  }
};
