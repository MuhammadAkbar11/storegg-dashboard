import { DataTypes, Model } from "sequelize";
import AutoIncrementField from "../helpers/autoNumberField.helper.js";
import MySQLConnection from "../config/db.config.js";
import DayjsUTC from "../helpers/date.helper.js";

class User extends Model {}

User.init(
  {
    user_id: {
      primaryKey: true,
      type: DataTypes.STRING(25),
      field: "user_id",
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "name",
    },
    username: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "username",
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
    status: {
      type: DataTypes.ENUM("PENDING", "ACTIVE", "INACTIVE", "SUSPENDED"),
      allowNull: false,
      defaultValue: "PENDING",
      field: "status",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      defaultValue: "+62813-0000-0000",
      field: "phone_number",
    },
  },
  {
    hooks: {
      beforeCreate: async function (user, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoIncrementField("user_id", datePrefix, 12);
        user.dataValues.user_id = ID;
      },
      beforeBulkCreate: async function (users, options) {
        for (let i = 0; i < users.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoIncrementField("user_id", datePrefix, 12);
          console.log(ID);
          users[i].dataValues.user_id = ID;
        }
        options.individualHooks = false;
      },
    },
    sequelize: MySQLConnection,
    modelName: "Users",
    tableName: "gg_users",
    deletedAt: false,
  }
);

export default User;
