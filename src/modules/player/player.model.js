import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../../helpers/connect.helper.js";

class Player extends Model {
  static associate(models) {
    Player.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "users",
    });
  }
}

Player.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT(20),
    },
    player_id: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(20),
    },
    user_id: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(20),
      field: "user_id",
    },
    phone_number: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: ConnectSequelize,
    modelName: "Players",
    tableName: "gg_players",
    deletedAt: false,
  }
);

export default Player;
