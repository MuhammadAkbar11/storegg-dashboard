import { validationResult } from "express-validator";
import { Strategy } from "passport-local";
import BaseError from "../../helpers/baseError.helper.js";
import UserModel from "../../models/User.model.js";

const localStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    console.log("helll");
    try {
      const user = await UserModel.findOne({ email: email });

      if (user) {
        return done(null, user);
      }
      throw new Error("Oppss");
    } catch (error) {
      console.log(error);
      done(error, profile);
    }
  }
);

export default localStrategy;
