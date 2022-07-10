import mongoose from "mongoose";

const nominalSchema = mongoose.Schema(
  {
    coinNominal: {
      type: Number,
      default: 0,
    },
    coinName: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const NominalModel = mongoose.model("NominalModel", nominalSchema, "nominals");

export default NominalModel;
