import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Administrator from "../../models/admin.model.js";
import User from "../../models/user.model.js";

export const findOneAdmin = async filter => {
  try {
    const data = await Administrator.findOne({ ...filter });
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
