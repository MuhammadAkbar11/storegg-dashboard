import { Strategy } from "passport-local";
import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import { findOneUser } from "../../modules/user/user.repository.js";

const LocalStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    try {
      const user = await findOneUser({
        where: {
          email: email,
        },
      });
      if (user) {
        return done(null, user);
      }
      throw new BaseError("AUTHENTICATION", "Failed to Login", 400, true, {
        errorView: "auth/login",
      });
    } catch (err) {
      Logger.error(`[passport] LocalStrategy`, err);
      const error = new BaseError(
        "AUTHENTICATION",
        err?.message || "Failed to Login",
        err?.status || 400,
        true,
        { ...err }
      );

      done(new TransfromError(error));
    }
  }
);

export default LocalStrategy;
