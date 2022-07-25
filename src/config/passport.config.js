import passport from "passport";
import BaseError from "../helpers/baseError.helper.js";
import { findUserById } from "../modules/user/user.repository.js";
import GoogleStrategy from "./strategies/google.strategy.js";
import LocalStrategy from "./strategies/local.strategy.js";

export default function () {
  passport.use(LocalStrategy);
  passport.use(GoogleStrategy);

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (err) {
      const error = new BaseError(
        "AUTHENTICATION",
        err?.message || "Failed to Login",
        err?.status || 400,
        true,
        { ...err }
      );
      done(error, user);
    }
  });
}
