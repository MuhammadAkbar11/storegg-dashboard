import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";
import DayjsUTC from "../helpers/date.helper.js";

class History extends Model {}

History.init(
  {
    history_id: {
      allowNull: true,
      primaryKey: true,
      type: DataTypes.STRING(25),
      field: "history_id",
    },
    history_vcrtopup_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "history_vchrtopup_id",
    },
    history_payment_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "history_payment_id",
    },
    history_player_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "history_player_id",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (records, options) {
        for (let i = 0; i < records.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoNumberField("history_id", datePrefix, 12);
          records[i].dataValues.history_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (record, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoNumberField("history_id", datePrefix, 12);
        record.dataValues.history_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "Histories",
    tableName: "gg_histories",
  }
);

export default History;
