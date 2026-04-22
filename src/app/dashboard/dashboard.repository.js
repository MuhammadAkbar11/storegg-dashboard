import Logger from "../../helpers/logger.helper.js";
import Sequelize from "sequelize";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { Rupiah } from "../../helpers/index.helper.js";
import Transaction from "../../models/transaction.model.js";
import Voucher from "../../models/voucher.model.js";
import Player from "../../models/player.model.js";
import { findAllCategories } from "../category/category.repository.js";
import DayjsUTC from "../../helpers/date.helper.js";

const Op = Sequelize.Op;

export const findDashboardWidgets = async () => {
  try {
    const transaction = await Transaction.count({
      where: {},
    });

    const revenue = await Transaction.sum("value", {
      where: {
        status: {
          [Op.like]: `%success%`,
        },
      },
    });

    const player = await Player.count({});
    const voucher = await Voucher.count({});

    return {
      transaction: transaction,
      revenue: revenue ? Rupiah(+revenue).slice(0, -3) : 0,
      player,
      voucher,
    };
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findDashboardWidgets");
    throw new TransfromError(error);
  }
};

export const findVoucherTopupDashboard = async () => {
  try {
    const month = DayjsUTC().month() + 1;

    let monthsArray = [...Array(month).keys()].map(x => {
      return String(x + 1).length > 1 ? `${x + 1}` : `0${x + 1}`;
    });
    if (monthsArray.length >= 4) {
      monthsArray = monthsArray.slice(
        monthsArray.length - 4,
        monthsArray.length
      );
    }

    const result = await Transaction.count({
      where: {
        created_at: Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("created_at")),
          month
        ),
      },
      attributes: [
        "status",
        // [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
      ],
      group: ["status"],
    });

    if (result.length !== 0) {
      return {
        count: result?.reduce((acc, curr) => {
          acc[curr["status"]] = curr.count;
          return acc;
        }, {}),
        data: {
          labels: result?.map(lb => {
            let status = lb.status;

            if (status.includes("success")) {
              status = "Selesai";
            }

            if (status.includes("failed")) {
              status = "Gagal";
            }
            if (status.includes("pending")) {
              status = "Tertunda";
            }

            return `${status.charAt(0).toUpperCase() + status.slice(1)}`;
          }),
          series: result?.map(s => s.count),
        },
      };
    }

    return {
      count: { pending: 0, success: 0, failed: 0 },
      data: {
        labels: ["Tertunda", "Selesai", "Gagal"],
        series: [0, 0, 0],
      },
    };
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findVoucherTopupDashboard");
    throw new TransfromError(error);
  }
};

export const findCategoriesTopupDashboard = async () => {
  try {
    const year = DayjsUTC().year();

    const result = await Transaction.count({
      where: {
        created_at: Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("created_at")),
          year
        ),
      },
      attributes: [
        "category_id",
        // [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
      ],
      group: ["category_id"],
    });

    if (result.length !== 0) {
      const category = await findAllCategories({ where: {} });

      category.forEach(element => {
        result.forEach(data => {
          if (data.category_id === element.category_id) {
            data.name = element.name;
          }
        });
      });

      const series = result?.map(s => s.count);
      const total = series?.reduce((accumulator, curr) => accumulator + curr);
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
    }

    return {
      count: [],
      data: {
        labels: ["Empty", "Empty", "Empty"],
        series: [0, 0, 0],
        total: 0,
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
      include: [
        {
          model: Voucher,
          as: "voucher",
        },
      ],
      where: {
        "$voucher.status$": "Y",
      },
      group: ["voucher_id"],
    });

    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] bestSellingVouchersDashboard");
    throw new TransfromError(error);
  }
};
