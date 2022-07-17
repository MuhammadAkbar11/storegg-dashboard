import { checkSchema } from "express-validator";

const transactionValidation = checkSchema({
  historyVoucherTopup: {
    trim: true,
    notEmpty: {
      errorMessage: "historyVoucherTopup tidak boleh kosong",
    },
  },
  historyPayment: {
    trim: true,
    notEmpty: {
      errorMessage: "historyPayment tidak boleh kosong",
    },
  },
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "name tidak boleh kosong",
    },
  },
  accountUser: {
    trim: true,
    notEmpty: {
      errorMessage: "accountUser tidak boleh kosong",
    },
  },
  tax: {
    trim: true,
    notEmpty: {
      errorMessage: "tax tidak boleh kosong",
    },
  },
  value: {
    trim: true,
    notEmpty: {
      errorMessage: "value tidak boleh kosong",
    },
  },
  status: {
    trim: true,
    notEmpty: {
      errorMessage: "status tidak boleh kosong",
    },
  },
});

export default transactionValidation;
