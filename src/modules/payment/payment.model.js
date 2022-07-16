import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "N",
    },
    banks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankModel",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PaymentModel = mongoose.model("PaymentModel", paymentSchema, "payments");

export default PaymentModel;
