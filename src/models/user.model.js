import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class User extends Model {}

User.init(
  {
    user_id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "user_id",
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "name",
    },
    email: {
      unique: true,
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "email",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password",
    },
    role: {
      type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN", "PLAYER"),
      allowNull: false,
      field: "role",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: ConnectSequelize,
    modelName: "Users",
    tableName: "gg_users",
    deletedAt: false,
  }
);

export default User;
