import path from "path";
import sharp from "sharp";
import MySQLConnection from "../../config/db.config.js";
import { MODE } from "../../config/env.config.js";
import { DEFAULT_USER_PP } from "../../constants/index.constants.js";
import { GeneratePassword } from "../../helpers/authentication.helper.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { RenameFile, UnlinkFile } from "../../helpers/index.helper.js";
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

export const updateAdmin = async payload => {
  const t = await MySQLConnection.transaction();
  try {
    const {
      admin_id,
      user_id,
      username,
      phone_number,
      name,
      status,
      role,
      fileimg,
      address,
      oldAvatar,
    } = payload;

    const fileImgData = fileimg.data;
    let avatar = oldAvatar;
    if (fileImgData) {
      const playerImg = RenameFile(fileImgData.filename, "GGAdmin", username);
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

    await User.update(
      {
        username,
        phone_number,
        name,
        avatar,
        status,
        role,
      },
      {
        where: {
          user_id: user_id,
        },
        transaction: t,
      }
    );

    await Administrator.update(
      { address },
      {
        where: {
          admin_id: admin_id,
        },
      }
    );

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    console.error("[EXCEPTION] updateAdmin", error);
    throw new TransfromError(error);
  }
};

export const createAdmin = async payload => {
  const t = await MySQLConnection.transaction();
  try {
    const { username, phone_number, name, email, status, role, address } =
      payload;

    const avatar = DEFAULT_USER_PP;
    const password = await GeneratePassword("123456");
    const user = await User.create(
      {
        email,
        username,
        phone_number,
        name,
        avatar,
        status,
        role,
        password,
      },
      {
        transaction: t,
      }
    );

    await Administrator.create(
      { address, user_id: user.user_id },
      { transaction: t }
    );

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    console.error("[EXCEPTION] createAdmin", error);
    throw new TransfromError(error);
  }
};

export const deleteOneAdmin = async payload => {
  const t = await MySQLConnection.transaction();
  try {
    const { admin_id, user_id } = payload;

    await Administrator.destroy(
      { where: { admin_id: admin_id } },
      { transaction: t }
    );

    await User.destroy(
      {
        where: {
          user_id: user_id,
        },
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    console.error("[EXCEPTION] createAdmin", error);
    throw new TransfromError(error);
  }
};
