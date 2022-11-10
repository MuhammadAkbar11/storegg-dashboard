import { DataTypes, Model } from "sequelize";
import AutoIncrementField from "../helpers/autoNumberField.helper.js";
import MySQLConnection from "../config/db.config.js";
import DayjsUTC from "../helpers/date.helper.js";

class Player extends Model {}

Player.init(
  {
    player_id: {
      primaryKey: true,
      type: DataTypes.STRING(25),
      field: "player_id",
    },
    user_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "user_id",
    },
    favorite: {
      allowNull: true,
      type: DataTypes.STRING(15),
      field: "favorite",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (admins, options) {
        for (let i = 0; i < admins.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoIncrementField("player_id", datePrefix, 12);
          admins[i].dataValues.player_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (admin, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoIncrementField("player_id", datePrefix, 12);
        admin.dataValues.player_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "Players",
    tableName: "gg_players",
    deletedAt: false,
  }
);

export default Player;
