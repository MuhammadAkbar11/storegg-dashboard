import Logger from "../../helpers/logger.helper.js";
import Sequelize from "sequelize";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { Rupiah } from "../../helpers/index.helper.js";
import Transaction from "../../models/transaction.model.js";
import Voucher from "../../models/voucher.model.js";
import Player from "../../models/player.model.js";
import { findAllCategories } from "../category/category.repository.js";

const Op = Sequelize.Op;

export const findDashboardWidgets = async () => {
  try {
    const transaction = await Transaction.count({
      where: {},
    });

    const revenue = await Transaction.findAll({
      where: {
        status: {
          [Op.like]: `%success%`,
        },
      },
      attributes: [
        "value",
        [Sequelize.fn("SUM", Sequelize.col("value")), "value"],
      ],
    });

    const player = await Player.count({});
    const voucher = await Voucher.count({});

    return {
      transaction: transaction,
      revenue: revenue?.length ? Rupiah(+revenue[0].value).slice(0, -3) : 0,
      player,
      voucher,
    };
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findDashboardTransaction");
    throw new TransfromError(error);
  }
};

export const findVoucherTopupDashboard = async () => {
  try {
    const result = await Transaction.count({
      attributes: [
        "status",
        // [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
      ],
      group: ["status"],
    });

    return {
      count: result.reduce((acc, curr) => {
        acc[curr["status"]] = curr.count;
        return acc;
      }, {}),
      data: {
        labels: result.map(lb => {
          let status = lb.status;

          if (status.includes("success")) {
            status = "finished";
          }

          if (status.includes("failed")) {
            status = "Rejected";
          }

          return `${status.charAt(0).toUpperCase() + status.slice(1)}`;
        }),
        series: result.map(s => s.count),
      },
    };
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findProductOrdersDashboard");
    throw new TransfromError(error);
  }
};

export const findCategoriesTopupDashboard = async () => {
  try {
    const result = await Transaction.count({
      attributes: [
        "category_id",
        // [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
      ],
      group: ["category_id"],
    });

    const category = await findAllCategories({ where: {} });

    category.forEach(element => {
      result.forEach(data => {
        if (data.category_id === element.category_id) {
          data.name = element.name;
        }
      });
    });

    const series = result.map(s => s.count);
    const total = series.reduce((accumulator, curr) => accumulator + curr);
    return {
      count: result.map(item => {
        item.percentage = parseInt((item.count / total) * 100) + "%";
        return { ...item };
      }),

      data: {
        labels: result.map(ct => ct.name),
        series: series.map(s => parseInt((s / total) * 100)),
        total: total,
      },
    };
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findProductOrdersDashboard");
    throw new TransfromError(error);
  }
};

export const findBestSellingVouchersDashboard = async () => {
  try {
    const result = await Transaction.count({
      attributes: [
        "category_id",
        // [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
      ],
      group: ["category_id"],
    });

    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] bestSellingVouchersDashboard");
    throw new TransfromError(error);
  }
};
