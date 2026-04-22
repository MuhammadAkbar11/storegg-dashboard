import { checkSchema } from "express-validator";

const nominalValidation = checkSchema({
  coinQuantity: {
    trim: true,
    notEmpty: {
      errorMessage: "Nominal tidak boleh kosong",
    },
  },
  coinName: {
    trim: true,
    notEmpty: {
      errorMessage: "Nama Koin tidak boleh kosong",
    },
  },
  price: {
    trim: true,
    notEmpty: {
      errorMessage: "Harga tidak boleh kosong",
    },
  },
  description: {
    trim: true,
    notEmpty: {
      errorMessage: "Description tidak boleh kosong",
    },
  },
});

export default nominalValidation;
