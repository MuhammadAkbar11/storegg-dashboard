import path from "path";
import sharp from "sharp";
import MySQLConnection from "../../config/db.config.js";
import { MODE } from "../../config/env.config.js";
import {
  DEFAULT_USER_PP,
  ENV_STATIC_FOLDER_NAME,
} from "../../constants/index.constants.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { RenameFile, UnlinkFile } from "../../helpers/index.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Category from "../../models/category.model.js";
import Player from "../../models/player.model.js";
import User from "../../models/user.model.js";

export const findAllPlayer = async (
  filter = {
    where: {},
  }
) => {
  try {
    const result = await Player.findAll({
      ...filter,
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["created_at", "updated_at", "password"],
          },
        },
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findAllPlayer");
    throw new TransfromError(error);
  }
};

export const findOnePlayer = async filter => {
  try {
    const result = await Player.findOne({
      ...filter,
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["created_at", "updated_at", "password"],
          },
        },
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findOnePlayer");
    throw new TransfromError(error);
  }
};

export const findPlayerById = async id => {
  try {
    const result = await Player.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["created_at", "updated_at", "password"],
          },
        },
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findOneById");
    throw new TransfromError(error);
  }
};

export const createPlayer = async data => {
  const t = await MySQLConnection.transaction();

  try {
    const createdUser = await User.create(data, { transaction: t });

    const result = await Player.create(
      { user_id: createdUser.user_id, favorite: data.favorite },
      { transaction: t }
    );

    await t.commit();

    const playerUser = {
      ...createdUser.dataValues,
    };

    delete playerUser.password;
    return { ...result.dataValues, ...playerUser };
  } catch (error) {
    Logger.error(error, "[EXCEPTION] createPlayer");
    await t.rollback();
    throw new TransfromError(error);
  }
};

export const updatePlayer = async (id, payload) => {
  try {
    const { username, phone_number, name, fileimg, oldAvatar } = payload;
    const fileImgData = fileimg.data;
    let avatar = oldAvatar;
    if (fileImgData) {
      const playerImg = RenameFile(fileImgData.filename, "GGPlayer", username);
      await sharp(fileImgData.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(fileImgData.destination, playerImg));

      UnlinkFile(fileImgData.path, false);
      avatar = `/uploads/users/${playerImg}`;

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
      },
      {
        where: {
          user_id: id,
        },
      }
    );

    return result;
  } catch (error) {
    console.error("[EXCEPTION] updatePlayer", error);
    throw new TransfromError(error);
  }
};

export const deletePlayerById = async id => {
  try {
    const result = await Player.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deletePlayerById", error);
    throw new TransfromError(error);
  }
};
