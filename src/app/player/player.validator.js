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
    username: {
      trim: true,
      notEmpty: {
        errorMessage: "username tidak boleh kosong",
      },
      custom: {
        options: value => {
          const ex = value.replace(/\s/, "");
          if (/\s/.test(value)) {
            throw new Error(
              `username tidak mendukung karakter spasi, username yang dianjurkan seperti: ${ex}`
            );
          }
          return true;
        },
      },
    },
    phoneNumber: {
      escape: true,
      trim: true,
      notEmpty: {
        errorMessage: "phoneNumber tidak boleh kosong",
      },
    },
  }),
};

export default playerValidation;
