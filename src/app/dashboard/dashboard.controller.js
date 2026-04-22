// import Sequelize from "sequelize";
import dayjs from "dayjs";
import { TransfromError } from "../../helpers/baseError.helper.js";
import DayjsUTC from "../../helpers/date.helper.js";
import { ToPlainObject } from "../../helpers/index.helper.js";
import { findAllTransaction } from "../transaction/transaction.repository.js";
import { findListVoucher } from "../voucher/voucher.repository.js";

import {
  findBestSellingVouchersDashboard,
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
    let vouchers = await findListVoucher({ where: {} });
    vouchers = ToPlainObject(vouchers);

    let topup = await findVoucherTopupDashboard();
    let transactions = await findAllTransaction({
      where: {},
      limit: 5,
      order: [["created_at", "desc"]],
    });
    let widgets = await findDashboardWidgets();
    let categoriesTopup = await findCategoriesTopupDashboard();
    let sellingVouchers = await findBestSellingVouchersDashboard();

    vouchers.forEach(element => {
      sellingVouchers.forEach(data => {
        if (data.voucher_id === element.voucher_id) {
          data.game_name = element.game_name;
          data.category = element.category.name;
          data.thumbnail = element.thumbnail;
        }
      });
    });

    sellingVouchers.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));

    transactions = ToPlainObject(transactions);

    if (transactions.length !== 0) {
      transactions.map(tr => {
        tr.created_at = dayjs(tr.created_at).format("DD MMM YYYY");
        return { ...tr };
      });
    }

    res.render("index", {
      title: "Dashboard",
      path: "/",
      flashdata: flashdata,
      errors: errors,
      transactions,
      topup,
      categoriesTopup,
      widgets,
      sellingVouchers,
      year: DayjsUTC().format("YYYY"),
    });
  } catch (error) {
    console.log(error);
    const baseError = new TransfromError(error);
    next(baseError);
  }
};
