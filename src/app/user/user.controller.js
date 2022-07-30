import { validationResult } from "express-validator";
import { httpStatusCodes } from "../../constants/index.constants.js";
import { ComparePassword } from "../../helpers/authentication.helper.js";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import { findOneUser } from "./user.repository.js";

export const getUserSignin = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    res.render("auth/login", {
      title: "Login",
      flashdata: flashdata,
      errors: null,
      values: null,
    });
  } catch (error) {
    error.errors = {
      errorView: "auth/login",
      renderData: { title: "Login", values: req.body },
    };
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postUserSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array());
      throw errValidate;
    }

    const user = await findOneUser({ where: { email: email } });

    if (!user) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        "User not found",
        true
      );
    }

    if (!user.role.includes("ADMIN")) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        "Email is not an admin email",
        true
      );
    }

    const passwordMatch = await ComparePassword(password, user.password);

    if (!passwordMatch) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        "Wrong password",
        true
      );
    }

    next();
  } catch (error) {
    // error.errors["errorView"] = "auth/login";
    // error.renderData = { title: "Login", values: req.body };
    // // const error
    const baseError = new BaseError(
      error?.name,
      error?.statusCode,
      error.message,
      true,
      {
        errorView: "auth/login",
        renderData: { title: "Login", values: req.body },
      }
    );
    Logger.error("[EXCEPTION] signin user", baseError);
    next(new TransfromError(baseError));
  }
};

// export const getSignUp = async (req, res, next) => {
//   try {
//     const flashdata = req.flash("flashdata");
//     res.render("auth/signup", {
//       title: "Sign Up",
//       flashdata: flashdata,
//       errors: null,
//       values: null,
//     });
//   } catch (error) {
//     const baseError = new TransfromError(error);
//     next(baseError);
//   }
// };

// export const postSignUp = async (req, res, next) => {
//   const { name, email, password } = req.body;
//   try {
//     const validate = validationResult(req);

//     if (!validate.isEmpty()) {
//       throw new ValidationError(validate.array(), "auth/signup", {
//         title: "Sign Up",
//         values: req.body,
//       });
//     }

//     const newUser = {
//       name,
//       email,
//       password,
//     };

//     const user = await UserModel.findOne({ email: email });

//     if (user) {
//       throw new BaseError(
//         "BAD_REQUEST",
//         httpStatusCodes.BAD_REQUEST,
//         "User already exist",
//         true,
//         {
//           errorView: "auth/signup",
//           renderData: { title: "Sign Up", values: req.body },
//         }
//       );
//     }

//     await UserModel.create(newUser);

//     next();
//   } catch (error) {
//     const baseError = new TransfromError(error);
//     next(baseError);
//   }
// };

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

// export const getGoogleAuthCallback = (req, res) => {
//   try {
//     res.redirect("/dashboard/");
//   } catch (error) {
//     req.flash("flashdata", {
//       type: "danger",
//       message: "Opps, Login failed please try again",
//     });
//     res.redirect("/auth");
//   }
// };

export const postLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};

//
