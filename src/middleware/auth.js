import { SESSION_SECRET } from "../config/env.config.js";
import BaseError, { TransfromError } from "../helpers/baseError.helper.js";
import { findOnePlayer } from "../modules/player/player.repository.js";
import { verifyJWT } from "../utils/jwt.js";

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/auth");
  }
}

function ensureGuest(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
}

async function ensurePlayerAuth(req, res, next) {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.replace("Bearer ", "")
      : null;

    if (!token) {
      throw new BaseError("NOT_AUTH", 401, "Token not found", true);
    }

    const { payload } = verifyJWT(token, SESSION_SECRET);

    if (!payload) {
      throw new BaseError(
        "NOT_AUTH",
        401,
        "Not authorized to acces this resource",
        true
      );
    }

    const player = await findOnePlayer({ _id: payload.id });

    delete player._doc.password;
    if (!player) {
      throw new BaseError(
        "NOT_AUTH",
        401,
        "Not authorized to acces this resource",
        true
      );
    }

    req.player = player;

    req.token = token;
    next();
  } catch (err) {
    const errors = new TransfromError(err);
    next(errors);
  }
}

export { ensureAuth, ensureGuest, ensurePlayerAuth };
