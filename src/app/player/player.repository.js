import path from "path";
import sharp from "sharp";
import { MODE } from "../../config/env.config.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { DEFAULT_USER_PP } from "../../utils/constants.js";
import { deleteFile, transformFilename } from "../../utils/index.js";
import PlayerModel from "./player.model.js";

export const findAllPlayer = async () => {
  try {
    const result = await PlayerModel.find({});
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllPlayer", error);
    throw new TransfromError(error);
  }
};

export const findOnePlayer = async filter => {
  try {
    const result = await PlayerModel.findOne({ ...filter });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOnePlayer", error);
    throw new TransfromError(error);
  }
};

export const findPlayerById = async id => {
  try {
    const result = await PlayerModel.findById(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOnePlayer", error);
    throw new TransfromError(error);
  }
};

export const createPlayer = async data => {
  try {
    const result = await PlayerModel.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createPlayer", error);
    throw new TransfromError(error);
  }
};

export const updatePlayer = async (id, payload) => {
  try {
    const { username, phoneNumber, name, fileimg, oldAvatar } = payload;
    const fileImgData = fileimg.data;
    let avatar = oldAvatar;
    if (fileImgData) {
      const playerImg = transformFilename(
        fileImgData.filename,
        "GGPlayer",
        username
      );
      await sharp(fileImgData.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(fileImgData.destination, playerImg));

      const deletedFile = deleteFile(fileImgData.path);
      console.log(deletedFile, "Delete Mutlter file");
      avatar = `/uploads/users/${playerImg}`;

      // delete previous avatar
      if (DEFAULT_USER_PP != oldAvatar) {
        const oldAvatarPath = MODE == "development" ? ".dev/public" : "public";
        const deleteOldAva = deleteFile(oldAvatarPath + oldAvatar);
        console.log(deleteOldAva, "Delete Old Image");
      }
    }
    const result = await PlayerModel.findByIdAndUpdate(id, {
      username,
      phoneNumber,
      name,
      avatar,
    });

    return result;
  } catch (error) {
    console.error("[EXCEPTION] updatePlayer", error);
    throw new TransfromError(error);
  }
};

export const deletePlayerById = async id => {
  try {
    const result = await PlayerModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deletePlayerById", error);
    throw new TransfromError(error);
  }
};
