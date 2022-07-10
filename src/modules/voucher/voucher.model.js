
import mongoose from "mongoose";

const voucherSchema = mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

const VoucherModel = mongoose.model(
  "VoucherModel",
  voucherSchema,
  "vouchers"
);

export default VoucherModel;

