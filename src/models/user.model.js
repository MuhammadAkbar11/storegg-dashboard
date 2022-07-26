import { DataTypes, Model } from "sequelize";
import { faker } from "@faker-js/faker";
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
      type: DataTypes.STRING(25),
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
    phone_number: {
      type: DataTypes.STRING(20),
      defaultValue: faker.phone.number("+62###-####-####"),
      field: "phone_number",
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
