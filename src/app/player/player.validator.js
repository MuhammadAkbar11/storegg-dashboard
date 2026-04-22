import { checkSchema } from "express-validator";

const playerValidation = {
  update: checkSchema({
    name: {
      escape: true,
      trim: true,
      notEmpty: {
        errorMessage: "name tidak boleh kosong",
      },
    },
    email: {
      notEmpty: {
        errorMessage: "Enter your email address",
      },
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    // username: {
    //   trim: true,
    //   notEmpty: {
    //     errorMessage: "username tidak boleh kosong",
    //   },
    //   custom: {
    //     options: value => {
    //       const ex = value.replace(/\s/, "");
    //       if (/\s/.test(value)) {
    //         throw new Error(
    //           `username tidak mendukung karakter spasi, username yang dianjurkan seperti: ${ex}`
    //         );
    //       }
    //       return true;
    //     },
    //   },
    // },
    phoneNumber: {
      escape: true,
      trim: true,
      notEmpty: {
        errorMessage: "phoneNumber tidak boleh kosong",
      },
    },
  }),
  updatePassword: checkSchema({
    currentPassword: {
      custom: {
        options: (value, { req }) => {
          const currentPassword =
            value || req.body.currentPassword || req.body.oldPassword;
          if (!currentPassword) {
            throw new Error("Enter your current password");
          }
          return true;
        },
      },
    },
    newPassword: {
      custom: {
        options: (value, { req }) => {
          const newPassword = value || req.body.newPassword || req.body.password;
          if (!newPassword) {
            throw new Error("Enter your new password");
          }

          if (newPassword.length < 5) {
            throw new Error("Password should be at least 5 chars long");
          }
          return true;
        },
      },
    },
    confirmNewPassword: {
      custom: {
        options: (value, { req }) => {
          const confirmPassword =
            value || req.body.confirmNewPassword || req.body.password2;
          const newPassword = req.body.newPassword || req.body.password;
          if (!confirmPassword) {
            throw new Error("Enter confirm password");
          }
          if (confirmPassword !== newPassword) {
            throw new Error("Password have to match!");
          }
          return true;
        },
      },
    },
  }),
};

export default playerValidation;
