import { validationResult } from "express-validator";
import path from "path";
import sharp from "sharp";
import { SESSION_SECRET } from "../../config/env.config.js";
import {
  DEFAULT_USER_PP,
  httpStatusCodes,
} from "../../constants/index.constants.js";
import {
  ComparePassword,
  GeneratePassword,
  SignJWT,
} from "../../helpers/authentication.helper.js";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import { RenameFile, UnlinkFile } from "../../helpers/index.helper.js";
import Category from "../../models/category.model.js";
import { createPlayer, findOnePlayer } from "../player/player.repository.js";
import { findOneUser } from "../user/user.repository.js";

export const apiPlayerSignup = async (req, res, next) => {
  const { email, name, password, category } = req.body;

  const { data: fileimgData } = req.fileimg;
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array());
      throw errValidate;
    }

    const existPlayer = await findOneUser({
      where: {
        email: email,
      },
    });

    if (existPlayer) {
      throw new ValidationError([
        {
          value: email,
          msg: "Email telah terdaftar!, silahkan masuk atau gunakan email lain yang belum terdaftar",
          param: "email",
          location: "body",
        },
      ]);
    }

    let avatar = DEFAULT_USER_PP;

    if (fileimgData) {
      const resultImg = RenameFile(fileimgData.filename, "GGPlayer", name);
      await sharp(fileimgData.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(fileimgData.destination, resultImg));
      UnlinkFile(fileimgData.path);
      avatar = `/uploads/users/${resultImg}`;
    }

    const newPlayer = {
      name: name,
      username: name.split(" ")[0].toLocaleLowerCase().trim(),
      email: email,
      password: await GeneratePassword(password),
      avatar: avatar,
      role: "PLAYER",
      favorite: category,
      status: "ACTIVE",
    };

    const player = await createPlayer(newPlayer);

    res.status(201).json({
      message:
        "Selamat! Akun anda telah terdaftar untuk langkah berikutnya silahkan masuk!",
      data: player,
    });
    return;
  } catch (error) {
    if (fileimgData) {
      UnlinkFile(fileimgData.path, false);
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

    const user = await findOneUser({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new ValidationError([
        {
          value: email,
          msg: "Email yang anda masukan belum terdaftar.",
          param: "email",
          location: "body",
        },
      ]);
    }

    if (!user.role.includes("PLAYER")) {
      throw new ValidationError([
        {
          value: email,
          msg: "Email yang anda masukan ditolak!",
          param: "email",
          location: "body",
        },
      ]);
    }

    const getPlayer = await findOnePlayer({
      where: {
        user_id: user.user_id,
      },
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    const player = {
      ...user.dataValues,
    };

    const matchPassword = await ComparePassword(password, user.password);
    if (matchPassword) {
      const payloadJWT = {
        user_id: player.user_id,
        username: player.username,
        name: player.name,
        email: player.email,
      };

      const token = SignJWT(payloadJWT, SESSION_SECRET, "7d");

      res.status(200).json({
        message: "Signin berhasil!",
        data: { ...payloadJWT, token },
      });
      return;
    } else {
      throw new ValidationError([
        {
          value: email,
          msg: "Password yang anda masukan salah!",
          param: "password",
          location: "body",
        },
      ]);
    }
  } catch (error) {
    next(new TransfromError(error));
  }
};

export const apiPlayerSession = async (req, res, next) => {
  try {
    return res.status(200).json({
      message: "Session Found!",
      data: req.player,
    });
  } catch (error) {
    next(new TransfromError(error));
  }
};
