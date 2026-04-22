import Sequelize from "sequelize";
import MySQLConnection from "../../config/db.config.js";
import Pagination from "../../helpers/pagination.helper.js";
import History from "../../models/history.model.js";
import HistoryPayment from "../../models/historyPayment.model.js";
import HistoryPlayer from "../../models/historyPlayer.model.js";
import HistoryVoucherTopup from "../../models/historyVoucherTopup.model.js";
import Transaction from "../../models/transaction.model.js";
import Logger from "../../helpers/logger.helper.js";
import { TransfromError } from "../../helpers/baseError.helper.js";

const Op = Sequelize.Op;

export const APIFindTransactionHistory = async filter => {
  const _limit = +filter.limit;
  const _page = filter.page;
  const _status = filter.status || "";
  const _player = filter.player;
  // const _search = filter.search;

  // const _searchQuery =
  //   _search && _search.trim() !== ""
  //     ? { [Op.like]: `%${_search}%` }
  //     : { [Op.like]: `%%` };

  let whereQuery = {
    player_id: _player,
    status: {
      [Op.like]: _status ? `%${_status}%` : "%%",
    },
  };

  // search query
  // if (_search) {
  //   whereQuery = {
  //     [Op.and]: [
  //       {
  //         player_id: _player,
  //       },
  //       {
  //         status: {
  //           [Op.like]: _status ? `%${_status}%` : "%%",
  //         },
  //       },
  //       {
  //         [Op.or]: [
  //           { name: _searchQuery },
  //           { value: _searchQuery },
  //           {
  //             "$history.history_voucher.game_name$": _searchQuery,
  //           },
  //         ],
  //       },
  //     ],
  //   };
  // }

  const paginated = new Pagination(_page, _limit, {
    defaultLimit: 10,
    itemKeyName: "histories",
  });

  const { limit, offset } = paginated.getPagination();

  try {
    const history = await Transaction.findAll({
      limit: limit,
      offset: offset,
      where: whereQuery,
      attributes: {
        exclude: ["updated_at", "history_id"],
      },
      order: [["created_at", "DESC"]],
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

    const countHistory = await Transaction.count({
      where: whereQuery,
    });

    const data = paginated.getPagingData(countHistory, history);

    const total = await Transaction.findAll({
      where: {
        player_id: _player,
      },
      attributes: [[Sequelize.fn("SUM", Sequelize.col("value")), "value"]],
    });

    return {
      totalSpent: total && total?.length !== 0 ? total[0]?.value : 0,
      ...data,
    };
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findTransactionHistory");
    throw new TransfromError(error);
  }
};
