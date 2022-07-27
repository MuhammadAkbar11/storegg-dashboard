import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class PaymentMethod extends Model {}

PaymentMethod.init(
  {
    payment_method_id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
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
    sequelize: sequelizeConnection,
    modelName: "PaymentMethods",
    tableName: "gg_payment_methods",
    deletedAt: false,
  }
);

export default PaymentMethod;
