import { ROLES, USER_STATUS } from "../../constants/index.constants.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { ToCapitalize } from "../../helpers/index.helper.js";
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

export const findListUserRoles = (selectedRole = "") => {
  return Object.keys(ROLES)
    .filter(r => r !== ROLES.PLAYER)
    .map(rl => {
      return {
        value: rl,
        name: rl
          .split("_")
          .map(t => ToCapitalize(t.toLocaleLowerCase()))
          .join(" "),
        selected: rl == selectedRole ? true : false,
      };
    });
};

export const findListUserStatus = (selectedStatus = "") => {
  return Object.keys(USER_STATUS).map(s => {
    return {
      value: s,
      name: s
        .split("_")
        .map(t => ToCapitalize(t.toLocaleLowerCase()))
        .join(" "),
      selected: s == selectedStatus ? true : false,
    };
  });
};
