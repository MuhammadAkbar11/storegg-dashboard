import { validationResult } from "express-validator";
import path from "path";
import sharp from "sharp";
import { SESSION_SECRET } from "../../config/env.config.js";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import { DEFAULT_USER_PP } from "../../utils/constants.js";
import httpStatusCodes from "../../utils/httpStatusCode.js";
import { deleteFile, transformFilename } from "../../utils/index.js";
import { signJWT } from "../../utils/jwt.js";
import { createPlayer, findOnePlayer } from "../player/player.repository.js";

export const apiPlayerSignup = async (req, res, next) => {
  const { email, name, password, category } = req.body;

  const { data: fileimgData } = req.fileimg;
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array());
      throw errValidate;
    }

    const existPlayer = await findOnePlayer({ email: email });

    if (existPlayer) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        `Email telah terdaftar silahkan masuk`,
        true
      );
    }

    let avatar = DEFAULT_USER_PP;

    if (fileimgData) {
      const resultImg = transformFilename(
        fileimgData.filename,
        "GGPlayer",
        name
      );
      await sharp(fileimgData.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(fileimgData.destination, resultImg));
      deleteFile(fileimgData.path);
      avatar = `/uploads/users/${resultImg}`;
    }

    const newPlayer = {
      name: name,
      username: name.split(" ")[0].toLocaleLowerCase().trim(),
      email: email,
      password: password,
      avatar: avatar,
      favorite: category,
    };

    const player = await createPlayer(newPlayer);

    delete player._doc.password;
    res.status(201).json({
      message:
        "Selamat! Akun anda telah terdaftar untuk langkah berikutnya silahkan masuk!",
      data: player,
    });
    return;
  } catch (error) {
    if (fileimgData) {
      deleteFile(fileimgData.path);
    }
    next(new TransfromError(error));
  }
};

export const apiPlayerSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array());
      throw errValidate;
    }

    const player = await findOnePlayer({ email: email });

    if (!player) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        `Email yang anda masukan belum terdaftar.`,
        true
      );
    }
    const matchPassword = await player.matchPassword(password);
    if (matchPassword) {
      const payloadJWT = {
        id: player._id,
        username: player.username,
        name: player.name,
        email: player.email,
        phoneNumber: player.phoneNumber,
        avatar: player.avatar,
      };

      const token = signJWT(payloadJWT, SESSION_SECRET, "7d");

      res.status(200).json({
        message: "Signin berhasil!",
        data: { ...payloadJWT, token },
      });
      return;
    } else {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        `Password yang anda masukan salah.`,
        true
      );
    }
  } catch (error) {
    next(new TransfromError(error));
  }
};
