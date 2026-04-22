import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoNumberField from "../helpers/autoNumberField.helper.js";

class PaymentMethod extends Model {}

PaymentMethod.init(
  {
    payment_method_id: {
      primaryKey: true,
      type: DataTypes.STRING(15),
      field: "payment_method_id",
    },
    type: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: "type",
    },
    status: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
      field: "status",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (records, options) {
        for (let i = 0; i < records.length; i++) {
          const ID = await AutoNumberField("payment_method_id", "", 7);
          records[i].dataValues.payment_method_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (record, options) {
        const ID = await AutoNumberField("payment_method_id", "", 7);
        record.dataValues.payment_method_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "PaymentMethods",
    tableName: "gg_payment_methods",
    deletedAt: false,
  }
);

export default PaymentMethod;
