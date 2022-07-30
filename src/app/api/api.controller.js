import { validationResult } from "express-validator";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import httpStatusCodes from "../../utils/httpStatusCode.js";
import { deleteFile } from "../../utils/index.js";
import { findBankById } from "../bank/bank.repository.js";
import CategoryModel from "../category/category.model.js";
import { findAllCategories } from "../category/category.repository.js";
import { findNominalById } from "../nominal/nominal.repository.js";
import { findPaymentById } from "../payment/payment.repository.js";
import { findPlayerById, updatePlayer } from "../player/player.repository.js";
import TransactionModel from "../transaction/transaction.model.js";
import {
  createTransaction,
  findTransactionById,
  findTransactionHistory,
} from "../transaction/transaction.repository.js";
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

export const apiGetListHistory = async (req, res, next) => {
  try {
    const { status = "" } = req.query;

    const { history, total } = await findTransactionHistory({
      status,
      player: req.player,
    });

    res.status(200).json({
      message: "Daftar history berhasil didapatkan",
      data: history,
      total: total.length ? total[0].value : 0,
    });
  } catch (error) {
    next(new TransfromError(error));
  }
};

export const apiGetDetailHistory = async (req, res, next) => {
  const { id: ID } = req.params;
  try {
    const history = await findTransactionById(ID);

    if (!history) {
      throw new BaseError("NOT_FOUND", 404, "History tidak ditemukan", true);
    }

    return res.status(200).json({
      message: "History berhasil didapatkan",
      data: history,
    });
  } catch (error) {
    if (error.kind == "ObjectId") {
      error.name = "NOT_FOUND";
      error.statusCode = 404;
      error.message = "History Tidak ditemukan";
    }

    next(new TransfromError(error));
  }
};

export const apiGetDashboard = async (req, res, next) => {
  try {
    const count = await TransactionModel.aggregate([
      { $match: { player: req.player._id } },
      {
        $group: {
          _id: "$category",
          value: { $sum: "$value" },
        },
      },
    ]);

    const category = await CategoryModel.find({});

    category.forEach(element => {
      count.forEach(data => {
        if (data._id.toString() === element._id.toString()) {
          data.name = element.name;
        }
      });
    });

    const history = await TransactionModel.find({ player: req.player._id })
      .populate("category")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Berhasil mendapat data Dashboard",
      data: history,
      count: count,
    });
  } catch (error) {
    next(new TransfromError(error));
  }
};

export const apiGetProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Berhasil mendapat profile",
      data: req.player,
    });
  } catch (error) {
    next(new TransfromError(error));
  }
};

export const apiPutProfile = async (req, res, next) => {
  const ID = req.player._id;

  const { username, name, phoneNumber } = req.body;

  const fileimg = req.fileimg;

  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array());
      throw errValidate;
    }

    let player = await findPlayerById(ID);

    if (!player) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        `Player tidak ditemukan`,
        true
      );
    }

    await updatePlayer(ID, {
      username: username,
      phoneNumber: phoneNumber,
      name: name,
      fileimg: fileimg,
      oldAvatar: player.avatar,
    });

    const updatedPlayer = await findPlayerById(ID);

    delete updatedPlayer._doc.password;
    res.status(201).json({
      message: "Berhasil mengubah profile",
      data: updatedPlayer,
    });
    return;
  } catch (error) {
    if (fileimg.data) {
      deleteFile(fileimg.data.path);
    }
    next(new TransfromError(error));
  }
};
