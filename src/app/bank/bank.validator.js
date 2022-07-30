import { checkSchema } from "express-validator";

const bankValidation = checkSchema({
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "Name Pemilik tidak boleh kosong",
    },
  },
  bankName: {
    trim: true,
    notEmpty: {
      errorMessage: "Nama Bank tidak boleh kosong",
    },
  },
  noRekening: {
    trim: true,
    notEmpty: {
      errorMessage: "Nomor Rekening tidak boleh kosong",
    },
  },
});

export default bankValidation;
