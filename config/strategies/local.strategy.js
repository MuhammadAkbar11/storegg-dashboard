import { Strategy } from "passport-local";
import UserModel from "../../models/User.model.js";

const localStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    try {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        return done(null, user);
      }
      throw new Error("Authentication Failed");
    } catch (error) {
      done(error);
    }
  }
);

export default localStrategy;
