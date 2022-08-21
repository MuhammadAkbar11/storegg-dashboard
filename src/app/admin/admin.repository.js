import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Administrator from "../../models/admin.model.js";
import Category from "../../models/category.model.js";
import User from "../../models/user.model.js";
import Voucher from "../../models/voucher.model.js";

export const findOneAdmin = async (filter, options = { getVoucher: true }) => {
  const { getVoucher } = options;
  let include = [
    {
      model: User,
      as: "user",
    },
  ];
  if (filter.include) {
    include = [...filter.include, ...include];
  }

  if (getVoucher) {
    include.push({
      model: Voucher,
      as: "vouchers",
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
  }

  try {
    const data = await Administrator.findOne({
      ...filter,
      include: include,
    });
    return data;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findOneAdmin");
    throw new TransfromError(error);
  }
};

export const findAllAdmin = async filter => {
  try {
    const data = await Administrator.findAll({
      ...filter,
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    return data;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findAllAdmin");
    throw new TransfromError(error);
  }
};
