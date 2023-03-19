import { validationResult } from "express-validator";
import Sequelize from "sequelize";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import Category from "../../models/category.model.js";
import Voucher from "../../models/voucher.model.js";
import { findOneVoucher } from "../voucher/voucher.repository.js";

import { findAllBank, findBankById } from "../bank/bank.repository.js";
// import CategoryModel from "../category/category.model.js";
import { findAllCategories } from "../category/category.repository.js";
import { findNominalById } from "../nominal/nominal.repository.js";
import {
  findAllPayment,
  findPaymentById,
} from "../payment/payment.repository.js";
import {
  findOnePlayer,
  findPlayerById,
  updatePlayer,
} from "../player/player.repository.js";
import { httpStatusCodes } from "../../constants/index.constants.js";
import { ToPlainObject, UnlinkFile } from "../../helpers/index.helper.js";
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
import Pagination from "../../helpers/pagination.helper.js";
import { SQL_COUNT_VOUCHER_TRANSACTIONS } from "../../utils/sqlQueries.js";
import { APIFindTransactionHistory } from "./api.repository.js";

const Op = Sequelize.Op;

export const apiGetVouchers = async (req, res, next) => {
  const _limit = +req.query.limit || 20;
  const _page = +req.query.page || 0;
  const _category = req.query.category || null;
  const _search = req.query.search;
  const _sortBy = req.query.sortBy || "game_name";
  const _orderBy = req.query.orderBy || "ASC";
  const featuredVoucher = _sortBy === "featured";
  let order = [[_sortBy, _orderBy]];
  let group = null;
  let query = {};

  let where = {
    status: "Y",
    name:
      _search && _search.trim() !== ""
        ? { [Op.like]: `%${_search}%` }
        : { [Op.like]: `%%` },
  };

  const paginated = new Pagination(_page, _limit, {
    defaultLimit: 20,
    itemKeyName: "vouchers",
  });

  const { limit, offset } = paginated.getPagination();

  if (limit) {
    query = {
      limit,
      ...query,
    };
  }

  if (offset) {
    query = {
      offset: offset,
      ...query,
    };
  }
  let attributes = [
    "voucher_id",
    "game_name",
    "game_name",
    "game_coin_name",
    "status",
    "thumbnail",
    "category_id",
  ];
  if (featuredVoucher) {
    attributes.push([
      Sequelize.literal(SQL_COUNT_VOUCHER_TRANSACTIONS),
      "total_transactions",
    ]);
    order = [[Sequelize.literal("total_transactions"), "DESC"]];
    group = ["Vouchers.voucher_id"];
  }

  try {
    const voucher = await Voucher.findAll({
      ...query,
      where: where,
      attributes: attributes,
      include: [
        {
          model: Category,
          as: "category",
          where: {
            name:
              _category && _category.trim() !== ""
                ? { [Op.like]: `%${_category}%` }
                : { [Op.like]: `%%` },
          },
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
        {
          model: Transaction,
          as: "transactions",
          attributes: [],
        },
      ],
      group: group,
      order: order,
    });

    const totalItems = await Voucher.count({
      ...query,
      where: where,
      include: [
        {
          model: Category,
          as: "category",
          where: {
            name:
              _category && _category.trim() !== ""
                ? { [Op.like]: `%${_category}%` }
                : { [Op.like]: `%%` },
          },
        },
      ],
    });

    const data = paginated.getPagingData(totalItems, voucher);
    res.status(200).json({
      message: "Berhasil mengambil data voucher",
      data: {
        search: _search,
        ...data,
      },
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
        status: "Y",
      },
      attributes: {
        exclude: ["admin_id", "created_at", "updated_at", "category_id"],
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

    const banks = await findAllBank({
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    const payments = await findAllPayment({
      where: {
        status: "Y",
      },
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    res.status(200).json({
      message: "Berhasil mengambil detail data voucher",
      data: { voucher, banks, payments },
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
    let value = resNominal.dataValues.price + tax;

    const historyVoucherTopup = {
      game_name: resVoucher.dataValues.game_name,
      category: resVoucher.dataValues.category ? resVoucher.category.name : "",
      thumbnail: resVoucher.dataValues.thumbnail,
      coin_name: resNominal.dataValues.coin_name,
      coin_quantity: resNominal.dataValues.coin_quantity,
      price: +resNominal.dataValues.price,
    };

    const historyPayment = {
      bank_account_name: resBank.dataValues.account_name,
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
  const _limit = +req.query.limit || 10;
  const _page = +req.query.page || 0;
  const _search = req.query.search;
  const _status = req.query.status || "";

  try {
    const result = await APIFindTransactionHistory({
      limit: _limit,
      page: _page,
      search: _search,
      player: req.player.player_id,
      status: _status,
    });

    res.status(200).json({
      ...result,
      message: "Daftar history berhasil didapatkan",
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
      history: history,
    });
  } catch (error) {
    next(new TransfromError(error));
  }
};

export const apiGetDashboard = async (req, res, next) => {
  try {
    const count_categories = await Category.findAll({
      where: {},
      attributes: [
        "category_id",
        "name",
        "description",
        [
          Sequelize.fn("sum", Sequelize.col("transactions.value")),
          "total_value",
        ],
      ],
      include: [
        {
          model: Transaction,
          as: "transactions",
          required: false,
          where: {
            player_id: req.player.player_id,
          },
          attributes: [],
        },
      ],
      group: ["category_id"],
    });

    const history = await findAllTransaction(
      {
        where: { player_id: req.player.player_id },
        limit: 5,
        order: [["created_at", "DESC"]],
      },
      true,
      true
    );

    res.status(200).json({
      message: "Berhasil mendapat data Dashboard",
      latest_transactions: history,
      topup_categories: count_categories,
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
