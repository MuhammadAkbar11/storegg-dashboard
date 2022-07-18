import { checkSchema } from "express-validator";

const playerValidation = checkSchema({
  name: {
    trim: true,
    notEmpty: {
    errorMessage: "name tidak boleh kosong",
    },
  },username: {
    trim: true,
    notEmpty: {
    errorMessage: "username tidak boleh kosong",
    },
  },email: {
    trim: true,
    notEmpty: {
    errorMessage: "email tidak boleh kosong",
    },
  },password: {
    trim: true,
    notEmpty: {
    errorMessage: "password tidak boleh kosong",
    },
  },avatar: {
    trim: true,
    notEmpty: {
    errorMessage: "avatar tidak boleh kosong",
    },
  },phoneNumber: {
    trim: true,
    notEmpty: {
    errorMessage: "phoneNumber tidak boleh kosong",
    },
  },status: {
    trim: true,
    notEmpty: {
    errorMessage: "status tidak boleh kosong",
    },
  },

});

export default playerValidation;
