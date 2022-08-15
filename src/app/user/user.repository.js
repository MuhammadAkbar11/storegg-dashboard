import { TransfromError } from "../../helpers/baseError.helper.js";
import User from "../../models/user.model.js";

export const findAllUsers = async filter => {
  try {
    const result = await User.findAll({ ...filter });

    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllUsers", error);
    throw new TransfromError(error);
  }
};

export const findCountUser = async filter => {
  try {
    const result = await User.count({ ...filter });

    return result;
  } catch (error) {
    console.error("[EXCEPTION] findCountUser", error);
    throw new TransfromError(error);
  }
};

export const findOneUser = async filter => {
  try {
    const result = await User.findOne({ ...filter });

    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneUser", error);
    throw new TransfromError(error);
  }
};

// Find one user by id
export const findUserById = async id => {
  try {
    let result = await User.findByPk(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findUserById", error);
    throw new TransfromError(error);
  }
};
