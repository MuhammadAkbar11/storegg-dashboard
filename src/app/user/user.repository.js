import path from "path";
import sharp from "sharp";
import { MODE } from "../../config/env.config.js";
import {
  DEFAULT_USER_PP,
  ENV_STATIC_FOLDER_NAME,
  ROLES,
  USER_STATUS,
} from "../../constants/index.constants.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import {
  RenameFile,
  ToCapitalize,
  UnlinkFile,
} from "../../helpers/index.helper.js";
import Logger from "../../helpers/logger.helper.js";
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

export const updateOneUser = async payload => {
  try {
    const {
      username,
      phone_number,
      name,
      fileimg,
      status,
      oldAvatar,
      user_id,
    } = payload;

    const fileImgData = fileimg?.data || null;
    let avatar = oldAvatar;
    if (fileImgData) {
      const userImg = RenameFile(fileImgData.filename, "GGPlayer", username);
      await sharp(fileImgData.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(fileImgData.destination, userImg));

      UnlinkFile(fileImgData.path, false);
      avatar = `/uploads/users/${userImg}`;

      // delete previous avatar
      if (DEFAULT_USER_PP != oldAvatar) {
        const oldAvatarPath =
          MODE != "production" ? ENV_STATIC_FOLDER_NAME : "public";
        const deleteOldAva = UnlinkFile(oldAvatarPath + oldAvatar);
        Logger.info(deleteOldAva, "Delete old Avatar");
      }
    }

    const result = await User.update(
      {
        username,
        phone_number,
        name,
        avatar,
        status,
      },
      {
        where: {
          user_id: user_id,
        },
      }
    );

    return result;
  } catch (error) {
    console.error("[EXCEPTION] updateOneUser", error);
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
