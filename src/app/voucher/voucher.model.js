import mongoose from "mongoose";

const voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    gameCoinName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    thumbnail: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
    },
    nominals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NominalModel",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  {
    timestamps: true,
  }
);

const VoucherModel = mongoose.model("VoucherModel", voucherSchema, "vouchers");

export default VoucherModel;
