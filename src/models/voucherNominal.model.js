import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";
import DayjsUTC from "../helpers/date.helper.js";

class VoucherNominal extends Model {}

VoucherNominal.init(
  {
    voucher_nominal_id: {
      primaryKey: true,
      type: DataTypes.STRING(25),
      field: "voucher_nominal_id",
    },
    nominal_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "nominal_id",
    },
    voucher_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "voucher_id",
    },
    self_granted: DataTypes.BOOLEAN,
  },
  {
    hooks: {
      beforeCreate: async function (records, options) {
        const datePrefix = DayjsUTC().format("DDMMYY");
        const ID = await AutoNumberField("voucher_nominal_id", datePrefix, 12);
        records.dataValues.voucher_nominal_id = ID;
      },
      beforeBulkCreate: async function (recordss, options) {
        for (let i = 0; i < recordss.length; i++) {
          const datePrefix = DayjsUTC().format("DDMMYY");
          const ID = await AutoNumberField(
            "voucher_nominal_id",
            datePrefix,
            12
          );

          recordss[i].dataValues.voucher_nominal_id = ID;
        }
        options.individualHooks = false;
      },
    },
    sequelize: MySQLConnection,
    modelName: "VoucherNominals",
    tableName: "gg_voucher_nominals",
  }
);

export default VoucherNominal;
