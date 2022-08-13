// import Sequelize from "sequelize";
import dayjs from "dayjs";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { ToPlainObject } from "../../helpers/index.helper.js";
import { findAllTransaction } from "../transaction/transaction.repository.js";

import {
  findCategoriesTopupDashboard,
  findDashboardWidgets,
  findVoucherTopupDashboard,
} from "./dashboard.repository.js";

// const Op = Sequelize.Op;

export const dashboard = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];

    // const transactionsCountByMonth = await Transaction.count({
    //   attributes: [
    //     [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
    //   ],
    //   group: ["month"],
    // });

    const topup = await findVoucherTopupDashboard();
    let transactions = await findAllTransaction({
      where: {},
      limit: 5,
      order: [["transaction_id", "desc"]],
    });
    const widgets = await findDashboardWidgets();

    const categoriesTopup = await findCategoriesTopupDashboard();

    transactions = ToPlainObject(transactions);

    if (transactions.length !== 0) {
      transactions.map(tr => {
        tr.created_at = dayjs(tr.created_at).format("DD MMM YYYY");
        return { ...tr };
      });
    }

    res.render("index", {
      title: "Welcome",
      path: "/",
      flashdata: flashdata,
      errors: errors,
      transactions,
      topup,
      categoriesTopup,
      widgets,
    });
  } catch (error) {
    console.log(error);
    const baseError = new TransfromError(error);
    next(baseError);
  }
};
