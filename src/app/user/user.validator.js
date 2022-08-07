import { checkSchema } from "express-validator";

const userValidation = {
  login: checkSchema({
    email: {
      notEmpty: {
        errorMessage: "Enter your email address",
      },
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    password: {
      notEmpty: {
        errorMessage: "Enter your password",
      },
    },
  }),

  signup: checkSchema({
    name: {
      trim: true,
      notEmpty: {
        errorMessage: "Enter your name",
      },
    },
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "Enter youe email address",
      },
      normalizeEmail: false,
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    password: {
      trim: true,
      notEmpty: {
        errorMessage: "Enter your password",
      },
      isLength: {
        errorMessage: "Password should be at least 5 chars long",
        options: {
          min: 5,
        },
      },
    },
    password2: {
      trim: true,
      notEmpty: {
        errorMessage: "Enter confirm password",
      },
      custom: {
        options: (value, { req, location, path }) => {
          if (value !== req.body.password) {
            throw new Error("Password have to match!");
          }
          return true;
        },
      },
    },
  }),
};

export default userValidation;
