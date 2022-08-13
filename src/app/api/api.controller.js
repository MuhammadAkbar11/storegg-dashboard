import { validationResult } from "express-validator";
import Sequelize from "sequelize";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import Category from "../../models/category.model.js";
import Voucher from "../../models/voucher.model.js";
import { findOneVoucher } from "../voucher/voucher.repository.js";

import { findBankById } from "../bank/bank.repository.js";
// import CategoryModel from "../category/category.model.js";
import { findAllCategories } from "../category/category.repository.js";
import { findNominalById } from "../nominal/nominal.repository.js";
import { findPaymentById } from "../payment/payment.repository.js";
import {
  findOnePlayer,
  findPlayerById,
  updatePlayer,
} from "../player/player.repository.js";
import { httpStatusCodes } from "../../constants/index.constants.js";
import { UnlinkFile } from "../../helpers/index.helper.js";
// import TransactionModel from "../transaction/transaction.model.js";
import {
  createTransaction,
  findAllTransaction,
  findTransactionById,
  findTransactionHistory,
} from "../transaction/transaction.repository.js";
// import VoucherModel from "../voucher/voucher.model.js";
import Logger from "../../helpers/logger.helper.js";
import Transaction from "../../models/transaction.model.js";

const Op = Sequelize.Op;

export const apiGetVouchers = async (req, res, next) => {
  const page = +req.query.page || 0;
  const limit = +req.query.limit ?? 10;
  const search = req.query.search;

  let query = {};

  if (limit) {
    query = {
      limit,
      ...query,
    };
  }

  if (page) {
    query = {
      offset: limit * (page - 1),
      ...query,
    };
  }

  try {
    const voucher = await Voucher.findAndCountAll({
      ...query,
      where: {
        name: search ? { [Op.like]: `%${search}%` } : { [Op.like]: `%%` },
      },
      order: [["name", "ASC"]],
      include: [
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
    });

    const pages = Math.ceil(voucher.count / +limit);
    res.status(200).json({
      message: "Berhasil mengambil data voucher",
      data: { pages, page, total: voucher.count, rows: voucher.rows },
    });
  } catch (err) {
    next(new TransfromError(err));
  }
};

export const apiGetDetailVoucher = async (req, res, next) => {
  try {
    const { ID } = req.params;
    const voucher = await findOneVoucher({
      where: {
        voucher_id: ID,
      },
    });

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
    const category = await findAllCategories({
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });
    res.status(200).json({ data: category });
  } catch (err) {
    next(new TransfromError(err));
  }
};

export const apiPostCheckout = async (req, res, next) => {
  const { accountGame, name, nominal, voucher, payment, bank } = req.body;
  try {
    const resVoucher = await findOneVoucher({
      where: {
        voucher_id: voucher,
      },
      attributes: {
        exclude: ["created_at", "updated_at", "admin_id"],
      },
    });

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

    const resBank = resPayment.banks.find(bnk => bnk.bank_id === bank);

    if (!resBank) {
      throw new BaseError(
        "NOT_FOUND",
        httpStatusCodes.NOT_FOUND,
        "Bank tidak ditemukan.",
        true
      );
    }

    const player = await findOnePlayer({
      where: {
        user_id: req.player.user_id,
      },
    });
    // console.log();

    let tax = (10 / 100) * resNominal.dataValues.price;
    let value = resNominal.dataValues.price - tax;

    const historyVoucherTopup = {
      game_name: resVoucher.dataValues.game_name,
      category: resVoucher.dataValues.category ? resVoucher.category.name : "",
      thumbnail: resVoucher.dataValues.thumbnail,
      coin_name: resNominal.dataValues.coin_name,
      coin_quantity: resNominal.dataValues.coin_quantity,
      price: +resNominal.dataValues.price,
    };

    const historyPayment = {
      account_name: resBank.dataValues.account_name,
      type: resPayment.dataValues.type,
      bank_name: resBank.dataValues.bank_name,
      no_rekening: resBank.dataValues.no_rekening,
    };
    const historyPlayer = {
      name: player?.user.name,
      email: player?.user.email,
      phone_number: player?.user.phone_number,
    };

    const payload = {
      historyVoucherTopup,
      historyPayment,
      historyPlayer,
      name,
      name: name,
      account_game: accountGame,
      tax: tax,
      value: value,
      voucher_id: resVoucher.dataValues.voucher_id,
      player_id: player.player_id,
      category_id: resVoucher.dataValues.category_id,
      payment_method_id: resPayment.dataValues.payment_method_id,
      status: "pending",
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
      total: total?.length ? total[0].value : 0,
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
    next(new TransfromError(error));
  }
};

export const apiGetDashboard = async (req, res, next) => {
  try {
    // const count = await TransactionModel.aggregate([
    //   { $match: { player: req.player._id } },
    //   {
    //     $group: {
    //       _id: "$category",
    //       value: { $sum: "$value" },
    //     },
    //   },
    // ]);

    const count = await Transaction.findAll(
      {
        where: { player_id: req.player.player_id },
        attributes: [
          "category_id",
          [Sequelize.fn("sum", Sequelize.col("value")), "value"],
        ],
        group: ["category_id"],
        raw: true,
      },
      false
    );

    const category = await findAllCategories({ where: {} });

    category.forEach(element => {
      count.forEach(data => {
        if (data.category_id === element.category_id) {
          data.name = element.name;
        }
      });
    });

    const history = await findAllTransaction({
      where: { player_id: req.player.player_id },
    });

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
  const userId = req.player.user_id;
  const { username, name, phoneNumber } = req.body;

  const fileimg = req.fileimg;

  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array());
      throw errValidate;
    }

    let player = await findOnePlayer({
      where: {
        user_id: userId,
      },
    });

    if (!player) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        `Player tidak ditemukan`,
        true
      );
    }

    await updatePlayer(userId, {
      username: username,
      phone_number: phoneNumber,
      name: name,
      fileimg: fileimg,
      oldAvatar: player.user.avatar,
    });

    const updatedPlayer = await findOnePlayer({
      where: {
        user_id: userId,
      },
    });

    res.status(201).json({
      message: "Berhasil mengubah profile",
      data: {
        user_id: updatedPlayer.user.user_id,
        username: updatedPlayer.user.username,
        name: updatedPlayer.user.name,
        email: updatedPlayer.user.email,
        phone_number: updatedPlayer.user.phone_number,
        avatar: updatedPlayer.user.avatar,
        favorite: updatedPlayer.dataValues.category.name,
      },
    });
    return;
  } catch (error) {
    if (fileimg.data) {
      UnlinkFile(fileimg.data.path);
    }
    next(new TransfromError(error));
  }
};
