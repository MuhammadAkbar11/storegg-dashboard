import { validationResult } from "express-validator";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import {
  createPlayer,
  deletePlayerById,
  findAllPlayer,
  findPlayerById,
  updatePlayer,
} from "./player.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    const player = await findAllPlayer();
    res.render("player/v_player", {
      title: "player",
      path: "/player",
      flashdata: flashdata,
      player: player,
      errors: errors,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postPlayer = async (req, res, next) => {
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // Response Validation Error Here
    return;
  }

  try {
    const newPlayerData = {
      name: "Name Data",
      username: "Username Data",
      email: "Email Data",
      password: "Password Data",
      avatar: "Avatar Data",
      phoneNumber: "PhoneNumber Data",
      status: "Status Data",
    };

    await createPlayer(newPlayerData);

    // Response Success
  } catch (error) {
    console.log("[controller] postPlayer ");
    const trError = new TransfromError(error);
    next(trError);
    // Redirect Error
    // req.flash("flashdata", {
    //   type: "error",
    //   title: "Oppps",
    //   message: "Gagal membuat Player",
    // });
    // res.redirect("/player?action_error=true");
  }
};

export const putPlayer = async (req, res, next) => {
  const ID = req.params.id;
  const { name, username, email, password, avatar, phoneNumber, status } =
    req.body;

  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    // response error validation
    return;
  }

  try {
    const player = await findPlayerById(ID);

    if (!player) {
      throw new BaseError("NOT_FOUND", 404, "player tidak ditemukan", true);
    }

    const updatedPlayerData = {
      name: name,
      username: username,
      email: email,
      password: password,
      avatar: avatar,
      phoneNumber: phoneNumber,
      status: status,
    };

    await updatePlayer(ID, updatedPlayerData);

    // Response Success
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};

export const deletePlayer = async (req, res, next) => {
  const ID = req.params.id;

  try {
    const player = await findPlayerById(ID);

    if (!player) {
      // response here
      return;
    }

    await deletePlayerById(ID);

    // Response Success
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};
