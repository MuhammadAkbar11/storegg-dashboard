import passport from "passport";
import BaseError from "../helpers/baseError.helper.js";
import { findUserById } from "../app/user/user.repository.js";
import GoogleStrategy from "./strategies/google.strategy.js";
import LocalStrategy from "./strategies/local.strategy.js";
import { findOneAdmin } from "../app/admin/admin.repository.js";

export default function () {
  passport.use(LocalStrategy);
  passport.use(GoogleStrategy);

  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);

      if (!user) {
        throw new BaseError("AUTHENTICATION", "Failed to Login", 400, true);
      }

      const admin = await findOneAdmin({
        where: {
          user_id: user.user_id,
        },
      });
      const reqUser = {
        ...admin.dataValues,
        ...user.dataValues,
      };
      done(null, reqUser);
    } catch (err) {
      const error = new BaseError(
        "AUTHENTICATION",
        err?.message || "Failed to Login",
        err?.status || 400,
        true,
        { ...err }
      );
      done(error, null);
    }
  });
}
