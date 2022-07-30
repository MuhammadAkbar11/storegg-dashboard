import sharp from "sharp";
import path from "path";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { MODE } from "../../config/env.config.js";
import Voucher from "../../models/voucher.model.js";
import { UnlinkFile } from "../../helpers/index.helper.js";
import Category from "../../models/category.model.js";
import Nominal from "../../models/nominal.model.js";
import sequelizeConnection from "../../config/db.config.js";

export const findListVoucher = async () => {
  try {
    const result = await Voucher.findAll({
      where: {},
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
    console.error("[EXCEPTION] findAllVoucher", error);
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
    console.error("[EXCEPTION] findOneVoucher", error);
    throw new TransfromError(error);
  }
};

export const findOneVoucher = async filter => {
  try {
    const result = await Voucher.findOne({ ...filter })
      .select("name category _id thumbnail user")
      .populate("category")
      .populate("user");
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneVoucher", error);
    throw new TransfromError(error);
  }
};

export const findVoucherNominals = async id => {
  try {
    const result = await Voucher.findById(id)
      .populate("category")
      .populate("nominals");
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneVoucher", error);
    throw new TransfromError(error);
  }
};

export const createVoucher = async (voucher, nominals) => {
  const t = await sequelizeConnection.transaction();
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
    console.error("[EXCEPTION] createVoucher", error);
    throw new TransfromError(error);
  }
};

export const createVoucherNominals = async data => {
  try {
    let result = [];

    return result;
  } catch (error) {
    console.error("[EXCEPTION] createVoucherNominals", error);
    throw new TransfromError(error);
  }
};

export const updateVoucher = async (id, data) => {
  try {
    const result = await Voucher.findById(id);

    const oldThumbnail = result.thumbnail;
    const fileImgData = data.fileimg.data;
    if (fileImgData) {
      const resultImg = "GG_" + fileImgData.filename;
      await sharp(fileImgData.path)
        .resize(281, 381)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(fileImgData.destination, resultImg));
      UnlinkFile(fileImgData.path);
      result.thumbnail = `/uploads/vouchers/${resultImg}`;

      if ("/uploads/Default-Thumbnail.png" != oldThumbnail) {
        const oldThumbnailPath =
          MODE == "development" ? ".dev/public" : "public";
        console.log(
          "/uploads/Default-Thumbnail.png" != oldThumbnail,

          oldThumbnailPath,
          oldThumbnail
        );
        UnlinkFile(oldThumbnailPath + oldThumbnail);
      }
    }

    result.name = data.name;
    result.category = data.category;
    result.gameCoinName = data.gameCoinName;
    result.nominals = data.nominals;

    return await result.save();
  } catch (error) {
    console.error("[EXCEPTION] updateVoucher", error);
    throw new TransfromError(error);
  }
};

export const updateVoucherStatusById = async id => {
  try {
    let voucher = await Voucher.findOne({ _id: id });
    let status = voucher.status === "Y" ? "N" : "Y";
    voucher = await Voucher.findOneAndUpdate(
      {
        _id: id,
      },
      { status }
    );
  } catch (error) {
    console.error("[EXCEPTION] updateVoucherStatusById", error);
    throw new TransfromError(error);
  }
};

export const deleteVoucherById = async id => {
  try {
    const result = await Voucher.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteVoucherById", error);
    throw new TransfromError(error);
  }
};
