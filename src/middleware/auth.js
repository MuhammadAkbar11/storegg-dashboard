import { SESSION_SECRET } from "../config/env.config.js";
import BaseError, { TransfromError } from "../helpers/baseError.helper.js";
import { VerifyJWT } from "../helpers/authentication.helper.js";
import { findOnePlayer } from "../app/player/player.repository.js";

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    if (!req.user.role.includes("ADMIN")) {
      res.redirect("/auth");
      return;
    }

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

    const { payload } = VerifyJWT(token, SESSION_SECRET);

    if (!payload) {
      throw new BaseError(
        "NOT_AUTH",
        401,
        "Not authorized to acces this resource",
        true
      );
    }

    let player = await findOnePlayer({
      where: {
        user_id: payload?.user_id ?? null,
      },
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
    });

    if (!player) {
      throw new BaseError(
        "NOT_AUTH",
        401,
        "Not authorized to acces this resource",
        true
      );
    }

    const authPlayer = {
      player_id: player.player_id,
      user_id: player.user.user_id,
      username: player.user.username,
      name: player.user.name,
      email: player.user.email,
      phone_number: player.user.phone_number,
      avatar: player.user.avatar,
      favorite: player.dataValues.category.name,
    };
    req.player = authPlayer;
    req.token = token;
    next();
  } catch (err) {
    const errors = new TransfromError(err);
    next(errors);
  }
}

const ensurePermission =
  (roles, redirect = false) =>
  (req, res, next) => {
    // const method = req.method;
    const user = req.user;

    const permission = roles.find(r => r === user.role);

    if (!permission) {
      if (redirect) {
        req.flash("flashdata", {
          type: "error",
          title: "Opps!",
          message: `Anda tidak memiliki akses ke sumber daya ini!`,
        });
        return res.redirect("back");
      }

      const errors = new TransfromError(
        new BaseError("FORBIDDEN", 403, "Access Denied", true, {
          errorView: "errors/blocked",
          renderData: {
            title: "Akses ditolak",
          },
          responseType: "page",
        })
      );
      return next(errors);
    }

    next();
  };

export { ensureAuth, ensureGuest, ensurePlayerAuth, ensurePermission };
