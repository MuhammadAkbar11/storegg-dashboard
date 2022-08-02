import passport from "passport";
import BaseError from "../helpers/baseError.helper.js";
import { findUserById } from "../app/user/user.repository.js";
import GoogleStrategy from "./strategies/google.strategy.js";
import LocalStrategy from "./strategies/local.strategy.js";
import { findOneAdmin } from "../app/admin/admin.repository.js";
import { httpStatusCodes } from "../constants/index.constants.js";

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
        throw new BaseError(
          "ERR_AUTHENTICATION",
          httpStatusCodes.BAD_REQUEST,
          "Failed to Login",
          true
        );
      }

      const admin = await findOneAdmin({
        where: {
          user_id: user.user_id,
        },
      });

      if (!admin) {
        throw new BaseError(
          "ERR_AUTHENTICATION",
          httpStatusCodes.BAD_REQUEST,
          "Failed to login because the email has not been registered as an administrative email",
          true
        );
      }

      const reqUser = {
        ...admin.dataValues,
        ...user.dataValues,
      };
      done(null, reqUser);
    } catch (err) {
      const error = new BaseError(
        err?.name || "ERR_AUTHENTICATION",
        err?.status || 400,
        err?.message || "Failed to Login",
        true,
        {
          ...err,
          errorView: "errors/500",
          renderData: { title: "Something Went Wrong" },
        }
      );
      done(error, null);
    }
  });
}
