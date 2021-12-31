import { checkSchema } from "express-validator";

const userValidate = method => {
  switch (method) {
    case "login":
      return checkSchema({
        email: {
          notEmpty: {
            errorMessage: "Enter youe email address",
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
      });
    default:
      return [];
  }
};

export { userValidate };
