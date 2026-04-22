import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, require: [true, "nama game harus diisi."] },
      category: { type: String, require: [true, "kategori harus diisi."] },
      thumbnail: { type: String },
      coinName: { type: String, require: [true, "nama koin harus diisi."] },
      coinQuantity: {
        type: String,
        require: [true, "jumlah koin harus diisi."],
      },
      price: { type: Number },
    },

    historyPayment: {
      name: { type: String, require: [true, "nama harus diisi."] },
      type: { type: String, require: [true, "tipe pembayaran harus diisi."] },
      bankName: { type: String, require: [true, "nama bank harus diisi."] },
      noRekening: {
        type: String,
        require: [true, "nomor rekening harus diisi."],
      },
    },

    name: {
      type: String,
      require: [true, "nama harus diisi"],
      maxlength: [225, "panjang nama harus antara 3 - 225 karakter"],
      minlength: [3, "panjang nama harus antara 3 - 225 karakter"],
    },

    accountUser: {
      type: String,
      require: [true, "nama akun harus diisi"],
      maxlength: [225, "panjang nama harus antara 3 - 225 karakter"],
      minlength: [3, "panjang nama harus antara 3 - 225 karakter"],
    },

    tax: {
      type: Number,
      default: 0,
    },

    value: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlayerModel",
    },

    historyPlayer: {
      name: { type: String },
      email: { type: String },
      phoneNumber: {
        type: Number,
        default: 0,
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = mongoose.model(
  "TransactionModel",
  transactionSchema,
  "transactions"
);

export default TransactionModel;
