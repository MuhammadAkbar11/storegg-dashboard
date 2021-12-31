import passport from "passport";
import UserModel from "../models/User.model.js";
import localStrategy from "./strategies/local.strategy.js";

export default function () {
  console.log("tesss");
  passport.use(localStrategy);

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
