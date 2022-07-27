import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class Nominal extends Model {}

Nominal.init(
  {
    nominal_id: {
      primaryKey: true,
      type: DataTypes.STRING(25),
      field: "nominal_id",
    },
    coin_quantity: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      field: "coin_quantity",
    },
    coin_name: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: "coin_name",
    },
    price: {
      type: DataTypes.BIGINT(30),
      allowNull: false,
      field: "price",
      defaultValue: 0,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Nominals",
    tableName: "gg_nominals",
  }
);

export default Nominal;
