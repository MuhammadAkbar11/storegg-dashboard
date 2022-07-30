import mongoose from "mongoose";

const bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    bankName: {
      type: String,
      require: true,
    },
    noRekening: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const BankModel = mongoose.model("BankModel", bankSchema, "banks");

export default BankModel;
