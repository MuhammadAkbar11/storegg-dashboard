import { checkSchema } from "express-validator";

const paymentValidation = checkSchema({
  type: {
    trim: true,
    notEmpty: {
      errorMessage: "Tipe tidak boleh kosong",
    },
  },
  banks: {
    notEmpty: {
      errorMessage: "Bank tidak boleh kosong",
    },
  },
});

export default paymentValidation;
