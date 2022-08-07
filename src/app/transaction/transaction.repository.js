import sequelizeConnection from "../../config/db.config.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import History from "../../models/history.model.js";
import HistoryPayment from "../../models/historyPayment.model.js";
import HistoryPlayer from "../../models/historyPlayer.model.js";
import HistoryVoucherTopup from "../../models/historyVoucherTopup.model.js";
import Transaction from "../../models/transaction.model.js";

export const findAllTransaction = async () => {
  try {
    const result = await Transaction.find({})
      .populate("player")
      .sort({ updatedAt: -1 });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllTransaction", error);
    throw new TransfromError(error);
  }
};

export const findTransactionById = async id => {
  try {
    const result = await Transaction.findById(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneTransaction", error);
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
    console.error("[EXCEPTION] createTransaction", error);
    throw new TransfromError(error);
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const result = await Transaction.findByIdAndUpdate(id, data);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] updateTransaction", error);
    throw new TransfromError(error);
  }
};

export const deleteTransactionById = async id => {
  try {
    const result = await Transaction.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteTransactionById", error);
    throw new TransfromError(error);
  }
};

export const updateTransactionStatusById = async (id, statusData) => {
  try {
    let payment = await Transaction.findOne({ _id: id });
    payment.status = statusData;
    return await payment.save();
  } catch (error) {
    console.error("[EXCEPTION] updateTransactionStatusById", error);
    throw new TransfromError(error);
  }
};

export const findTransactionHistory = async data => {
  try {
    const { status, player } = data;
    let query = {};

    if (status.length) {
      query = {
        ...query,
        status: { $regex: `${status}`, $options: "i" },
      };
    }

    if (player._id) {
      query = {
        ...query,
        player: player._id,
      };
    }

    const history = await Transaction.find(query);
    const total = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          value: { $sum: "$value" },
        },
      },
    ]);

    return { history, total };
  } catch (error) {
    console.error("[EXCEPTION] findTransactionHistory", error);
    throw new TransfromError(error);
  }
};
