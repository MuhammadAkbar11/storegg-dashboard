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
      escape: true,
      trim: true,
      notEmpty: {
        errorMessage: "username tidak boleh kosong",
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
