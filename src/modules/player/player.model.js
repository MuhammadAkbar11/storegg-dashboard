import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "email harus diisi"],
    },
    name: {
      type: String,
      require: [true, "nama harus diisi"],
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      require: [true, "kata sandi harus diisi"],
      maxlength: [225, "panjang password maksimal 225 karakter"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    role: {
      type: String,
      enum: ["ADMIN", "PLAYER"],
      default: "PLAYER",
    },
    avatar: { type: String },
    fileName: { type: String },
    phoneNumber: {
      type: String,
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
    },
  },
  {
    timestamps: true,
  }
);

playerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

playerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (this.password !== "") {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

const PlayerModel = mongoose.model("PlayerModel", playerSchema, "players");

export default PlayerModel;
