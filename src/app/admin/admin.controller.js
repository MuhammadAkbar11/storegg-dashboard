import dayjs from "dayjs";
import Sequelize from "sequelize";
import { validationResult } from "express-validator";
import { httpStatusCodes } from "../../constants/index.constants.js";
import { ComparePassword } from "../../helpers/authentication.helper.js";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import { ToPlainObject } from "../../helpers/index.helper.js";
import { findAllAdmin, findOneAdmin } from "../admin/admin.repository.js";
import Transaction from "../../models/transaction.model.js";

const Op = Sequelize.Op;

export const getListAdmin = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    let listAdmin = await findAllAdmin({});
    let countUsers = listAdmin.length;

    listAdmin = ToPlainObject(listAdmin);

    listAdmin.length !== 0 &&
      listAdmin.map(u => {
        u.created_at = dayjs(u.created_at).format("DD MMM YYYY");

        return { ...u };
      });

    res.render("user/admin/v_list_admin", {
      title: "List Admin",
      path: "/admin",
      flashdata: flashdata,
      errors: errors,
      // users: [],
      users: listAdmin,
      countUsers,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const getDetailAdmin = async (req, res, next) => {
  const ID = req.params.id;

  try {
    let admin = await findOneAdmin({
      where: {
        admin_id: ID,
      },
    });

    if (!admin) {
      throw new BaseError("NOT_FOUND", 404, "Admin is not found!", true, {
        errorView: "errors/404",
        renderData: {
          title: "Page Not Found",
        },
        responseType: "page",
      });
    }
    admin = ToPlainObject(admin);

    const adminVouchers = await Promise.all(
      admin.vouchers.map(async vcr => {
        const countTr = await Transaction.count({
          where: {
            voucher_id: vcr.voucher_id,
          },
        });
        vcr.created_at = dayjs(vcr.created_at).format("DD MMM YYYY");
        return { ...vcr, count: countTr };
      })
    );

    admin.vouchers = adminVouchers;
    // const adminVouchers = await fi
    console.log(admin);
    res.render("user/admin/v_detail", {
      title: admin.admin_id,
      path: "/admin",
      // flashdata: flashdata,
      // errors: errors,
      admin: admin,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};
