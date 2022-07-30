import passport from "passport";
import BaseError from "../helpers/baseError.helper.js";
import { findUserById } from "../app/user/user.repository.js";
import GoogleStrategy from "./strategies/google.strategy.js";
import LocalStrategy from "./strategies/local.strategy.js";

export default function () {
  passport.use(LocalStrategy);
  passport.use(GoogleStrategy);

  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log(id, "IIDD");
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
