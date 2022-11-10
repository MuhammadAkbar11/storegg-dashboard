import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";
import DayjsUTC from "../helpers/date.helper.js";

class HistoryPlayer extends Model {}

HistoryPlayer.init(
  {
    history_player_id: {
      primaryKey: true,
      allowNull: true,
      type: DataTypes.STRING(25),
      field: "history_player_id",
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "name",
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "email",
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "phone_number",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (records, options) {
        for (let i = 0; i < records.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoNumberField("history_player_id", datePrefix, 13);
          records[i].dataValues.history_player_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (record, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoNumberField("history_player_id", datePrefix, 13);
        record.dataValues.history_player_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "HistoryPlayers",
    tableName: "gg_history_players",
    deletedAt: false,
  }
);

export default HistoryPlayer;
