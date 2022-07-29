import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";
import DayjsUTC from "../helpers/date.helper.js";

class Administrator extends Model {}

Administrator.init(
  {
    admin_id: {
      primaryKey: true,
      type: DataTypes.STRING(25),
      field: "admin_id",
    },
    user_id: {
      type: DataTypes.STRING(25),
      field: "user_id",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (admins, options) {
        for (let i = 0; i < admins.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoNumberField("admin_id", datePrefix, 12);
          admins[i].dataValues.admin_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (admin, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoNumberField("admin_id", datePrefix, 12);
        admin.dataValues.admin_id = ID;
      },
    },
    sequelize: sequelizeConnection,
    modelName: "Administrators",
    tableName: "gg_administrators",
    deletedAt: false,
  }
);

export default Administrator;
