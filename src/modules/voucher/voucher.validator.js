import { checkSchema } from "express-validator";

const voucherValidation = checkSchema({
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "Nama game tidak boleh kosong",
    },
  },
  category: {
    notEmpty: {
      errorMessage: "Kategori tidak boleh kosong",
    },
  },
  nominals: {
    notEmpty: {
      errorMessage: "Nomanal tidak boleh kosong",
    },
  },
});

export default voucherValidation;
