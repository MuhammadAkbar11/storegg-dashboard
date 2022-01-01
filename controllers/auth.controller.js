import UserModel from "../models/User.model.js";
import BaseError from "../helpers/baseError.helper.js";
import { validationResult } from "express-validator";
import httpStatusCodes from "../utils/httpStatusCode.js";

export const getLogin = async (req, res) => {
  try {
    const flashdata = req.flash("flashdata");
    res.render("auth/login", {
      title: "Login",
      flashdata: flashdata,
      errors: null,
      values: null,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const baseError = new BaseError(
        "Validation",
        httpStatusCodes.BAD_REQUEST,
        "Bad Validation",
        false
      );
      baseError.validation(validate.array());

      return res.status(400).render("auth/login", {
        title: "Login",
        errors: baseError,
        values: req.body,
      });
    }

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      const baseError = new BaseError(
        "BadRequest",
        httpStatusCodes.BAD_REQUEST,
        "User not found",
        true
      );

      return res.status(400).render("auth/login", {
        title: "Login",
        errors: baseError,
        values: req.body,
      });
    }

    const passwordMatch = await user.matchPassword(password);

    if (!passwordMatch) {
      const baseError = new BaseError(
        "BadRequest",
        httpStatusCodes.BAD_REQUEST,
        "Wrong password",
        true
      );

      return res.status(400).render("auth/login", {
        title: "Login",
        errors: baseError,
        values: req.body,
      });
    }

    next();
  } catch (error) {
    const baseError = new BaseError(
      error.name,
      error.statusCode,
      error.message || error.description,
      true,
      { errorView: "errors/500" }
    );
    next(baseError);
  }
};

export const postLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};

export const getLocalAuthCallback = (req, res) => {
  try {
    res.redirect("/dashboard");
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Opps, Login failed please try again",
    });
    res.redirect("/auth");
  }
};
