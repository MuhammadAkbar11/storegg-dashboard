import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class PaymentBank extends Model {}

PaymentBank.init(
  {
    payment_bank_id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      field: "payment_bank_id",
    },
    bank_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "bank_id",
    },
    payment_method_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "payment_method_id",
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "PaymentBanks",
    tableName: "gg_payment_banks",
  }
);

export default PaymentBank;
