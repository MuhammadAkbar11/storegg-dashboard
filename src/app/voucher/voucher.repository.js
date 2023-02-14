import sharp from "sharp";
import path from "path";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { MODE } from "../../config/env.config.js";
import Voucher from "../../models/voucher.model.js";
import { RenameFile, UnlinkFile } from "../../helpers/index.helper.js";
import Category from "../../models/category.model.js";
import Nominal from "../../models/nominal.model.js";
import MySQLConnection from "../../config/db.config.js";
import Logger from "../../helpers/logger.helper.js";
import { ENV_STATIC_FOLDER_NAME } from "../../constants/index.constants.js";

const attributes = {
  exclude: ["created_at", "updated_at"],
};

export const findListVoucher = async (
  filter = {
    where: {},
    order: [["game_name", "asc"]],
  }
) => {
  try {
    const result = await Voucher.findAll({
      ...filter,
      include: [
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: Nominal,
          as: "nominals",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
    });

    return result;
  } catch (error) {
    Logger.error("[EXCEPTION] findAllVoucher", error);
    throw new TransfromError(error);
  }
};

export const findVoucherById = async id => {
  try {
    const result = await Voucher.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: Nominal,
          as: "nominals",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
    });
    return result;
  } catch (error) {
    Logger.error("[EXCEPTION] findOneVoucher", error);
    throw new TransfromError(error);
  }
};

export const findOneVoucher = async (filter = { attributes }) => {
  try {
    const result = await Voucher.findOne({
      ...filter,
      include: [
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
        {
          model: Nominal,
          as: "nominals",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
          through: {
            attributes: [],
          },
        },
      ],
      order: [[{ model: Nominal, as: "nominals" }, "coin_quantity", "ASC"]],
    });
    return result;
  } catch (error) {
    Logger.error("[EXCEPTION] findOneVoucher", error);
    throw new TransfromError(error);
  }
};

export const createVoucher = async (voucher, nominals) => {
  const t = await MySQLConnection.transaction();
  try {
    const result = await Voucher.create({ ...voucher }, { transaction: t });

    for (const nominal of nominals) {
      await result.addNominal(nominal, {
        through: {
          self_granted: true,
        },
        transaction: t,
      });
    }

    t.commit();
    return result;
  } catch (error) {
    t.rollback();
    Logger.error("[EXCEPTION] createVoucher", error);
    throw new TransfromError(error);
  }
};

export const updateVoucher = async (id, data) => {
  const { nominals, name, gameCoinName, category, fileimg } = data;

  const t = await MySQLConnection.transaction();
  try {
    const voucher = await findVoucherById(id);

    const oldNominals = await voucher.nominals;

    const oldThumbnail = voucher.thumbnail;
    const fileImgData = fileimg.data;
    // console.log(fileImgData);

    if (fileImgData) {
      Logger.info(
        "[UPLOAD] Will Delete temp uploaded file = " + fileImgData.path
      );
      const voucherImg = RenameFile(
        fileImgData.filename,
        "GG",
        voucher.voucher_id
      );
      Logger.info("[UPLOAD] Renaming and resave uploaded file...");
      await sharp(fileImgData.path)
        .resize(281, 381)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(fileImgData.destination, voucherImg));
      UnlinkFile(fileImgData.path, false);
      voucher.thumbnail = `/uploads/vouchers/${voucherImg}`;

      if ("/uploads/Default-Thumbnail.png" != oldThumbnail) {
        const oldThumbnailPath =
          MODE != "production" ? ENV_STATIC_FOLDER_NAME : "public";
        console.log(
          "/uploads/Default-Thumbnail.png" != oldThumbnail,

          oldThumbnailPath,
          oldThumbnail
        );
        UnlinkFile(oldThumbnailPath + oldThumbnail, false);
      }
    }

    voucher.game_name = name;
    voucher.category_id = category;
    voucher.game_coin_name = gameCoinName;

    if (oldNominals.length !== 0) {
      for (const nominal of oldNominals) {
        await voucher.removeNominal(nominal, {
          through: {
            self_granted: true,
          },
          transaction: t,
        });
      }
    }

    if (nominals && nominals.length !== 0) {
      const newNominals = await Nominal.findAll({
        where: {
          nominal_id: data.nominals,
        },
      });
      for (const nominal of newNominals) {
        await voucher.addNominal(nominal, {
          through: {
            self_granted: true,
          },
          transaction: t,
        });
      }
    }
    const result = await voucher.save({ transaction: t });
    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    Logger.error(error, "[EXCEPTION] updateVoucher");
    throw new TransfromError(error);
  }
};

export const updateVoucherStatusById = async id => {
  try {
    let voucher = await Voucher.findOne({
      where: {
        voucher_id: id,
      },
    });

    let status = voucher.status === "Y" ? "N" : "Y";
    return await Voucher.update(
      {
        status: status,
      },
      {
        where: {
          voucher_id: id,
        },
      }
    );
  } catch (error) {
    Logger.error(error, "[EXCEPTION] updateVoucherStatusById");
    throw new TransfromError(error);
  }
};

export const deleteVoucherById = async id => {
  try {
    const result = await Voucher.destroy({
      where: {
        voucher_id: id,
      },
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] deleteVoucherById");
    throw new TransfromError(error);
  }
};
