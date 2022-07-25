import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../../helpers/connect.helper.js";

class User extends Model {
  static associate(models) {
    User.hasOne(models.Players, {
      foreignKey: "user_id",
      as: "players",
    });
  }
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT(20),
    },
    user_id: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(20),
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN", "PLAYER"),
    },
    image: {
      type: DataTypes.STRING,
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
