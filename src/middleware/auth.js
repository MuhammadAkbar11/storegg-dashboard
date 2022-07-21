import { SESSION_SECRET } from "../config/env.config";
import BaseError, { TransfromError } from "../helpers/baseError.helper";
import PlayerModel from "../modules/player/player.model";
import { findOnePlayer } from "../modules/player/player.repository";
import { verifyJWT } from "../utils/jwt";

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

    // const data = jwt.verify(token, config.jwtKey);
    const data = verifyJWT(token, SESSION_SECRET);

    const player = await findOnePlayer({ _id: data.id });

    if (!player) {
      new BaseError(
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
