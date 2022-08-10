import Sequelize from "sequelize";
import sequelizeConnection from "../../config/db.config.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Category from "../../models/category.model.js";
import History from "../../models/history.model.js";
import HistoryPayment from "../../models/historyPayment.model.js";
import HistoryPlayer from "../../models/historyPlayer.model.js";
import HistoryVoucherTopup from "../../models/historyVoucherTopup.model.js";
import Player from "../../models/player.model.js";
import Transaction from "../../models/transaction.model.js";

const Op = Sequelize.Op;

export const findAllTransaction = async (filter = {}, associate = true) => {
  if (associate) {
    filter = {
      ...filter,
      include: [
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
        {
          model: Player,
          as: "player",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
        {
          model: History,
          as: "history",
          attributes: {
            exclude: [
              "created_at",
              "updated_at",
              "history_vcrtopup_id",
              "history_payment_id",
              "history_player_id",
            ],
          },
          include: [
            {
              model: HistoryPlayer,
              as: "history_player",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
            {
              model: HistoryPayment,
              as: "history_payment",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
            {
              model: HistoryVoucherTopup,
              as: "history_voucher",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
          ],
        },
      ],
    };
  }

  try {
    const result = await Transaction.findAll({
      ...filter,
    });

    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findAllTransaction");
    throw new TransfromError(error);
  }
};

export const findTransactionById = async id => {
  try {
    const result = await Transaction.findByPk(id, {
      attributes: {
        exclude: ["updated_at", "history_id"],
      },
      include: [
        {
          model: History,
          as: "history",
          attributes: {
            exclude: [
              "created_at",
              "updated_at",
              "history_vcrtopup_id",
              "history_payment_id",
              "history_player_id",
            ],
          },
          include: [
            {
              model: HistoryPlayer,
              as: "history_player",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
            {
              model: HistoryPayment,
              as: "history_payment",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
            {
              model: HistoryVoucherTopup,
              as: "history_voucher",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
          ],
        },
      ],
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findTransactionById");
    throw new TransfromError(error);
  }
};

export const createTransaction = async payload => {
  const t = await sequelizeConnection.transaction();

  const { historyVoucherTopup, historyPayment, historyPlayer } = payload;

  try {
    // const result = await Transaction.create({ ...data });

    delete payload.historyVoucherTopup;
    delete payload.historyPayment;
    delete payload.historyPlayer;

    const createdHistoryVoucherTopup = await HistoryVoucherTopup.create(
      historyVoucherTopup,
      {
        transaction: t,
      }
    );

    const createdHistoryPayment = await HistoryPayment.create(historyPayment, {
      transaction: t,
    });

    const createdHistoryPlayer = await HistoryPlayer.create(historyPlayer, {
      transaction: t,
    });

    const history_vcrtopup_id =
      createdHistoryVoucherTopup.dataValues.history_vcrtopup_id;
    const history_payment_id =
      createdHistoryPayment.dataValues.history_payment_id;
    const history_player_id = createdHistoryPlayer.dataValues.history_player_id;

    const createdHistory = await History.create(
      {
        history_vcrtopup_id,
        history_payment_id,
        history_player_id,
      },
      {
        transaction: t,
      }
    );

    payload.history_id = createdHistory.dataValues.history_id;

    const result = await Transaction.create(payload, {
      transaction: t,
    });

    await t.commit();

    return result;
  } catch (error) {
    await t.rollback();
    Logger.error(error, "[EXCEPTION] createTransaction");
    throw new TransfromError(error);
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const result = await Transaction.findByIdAndUpdate(id, data);
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] updateTransaction");
    throw new TransfromError(error);
  }
};

export const deleteTransactionById = async id => {
  try {
    const result = await Transaction.deleteOne({ _id: id });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] deleteTransactionById");
    throw new TransfromError(error);
  }
};

export const updateTransactionStatusById = async (id, statusData) => {
  try {
    const result = await Transaction.update(
      { status: statusData },
      {
        where: {
          transaction_id: id,
        },
      }
    );
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] updateTransactionStatusById");
    throw new TransfromError(error);
  }
};

export const findTransactionHistory = async values => {
  try {
    const { status, player } = values;
    let where = {};

    if (status?.length) {
      where = {
        ...where,
        status: {
          [Op.like]: `%${status}%`,
        },
      };
    }

    if (player.player_id) {
      where = {
        ...where,
        player_id: player.player_id,
      };
    }

    const history = await Transaction.findAll({
      where: where,
      attributes: {
        exclude: ["updated_at", "history_id"],
      },
      include: [
        {
          model: History,
          as: "history",
          attributes: {
            exclude: [
              "created_at",
              "updated_at",
              "history_vcrtopup_id",
              "history_payment_id",
              "history_player_id",
            ],
          },
          include: [
            {
              model: HistoryPlayer,
              as: "history_player",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
            {
              model: HistoryPayment,
              as: "history_payment",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
            {
              model: HistoryVoucherTopup,
              as: "history_voucher",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
          ],
        },
      ],
    });

    const total = await Transaction.findAll({
      where: where,
      attributes: [
        "value",
        [Sequelize.fn("SUM", Sequelize.col("value")), "value"],
      ],
      group: "value",
    });

    return { history, total: total };
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findTransactionHistory");
    throw new TransfromError(error);
  }
};
