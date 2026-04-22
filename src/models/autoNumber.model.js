import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";

class AutoNumber extends Model {}

AutoNumber.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      field: "id",
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "table_name",
    },
    field: {
      type: DataTypes.STRING(20),
      field: "field",
      defaultValue: "field",
    },
    prefix: {
      type: DataTypes.STRING(25),
      field: "prefix",
      defaultValue: "prefix",
    },
    value: {
      type: DataTypes.BIGINT(20),
      field: "value",
      defaultValue: 1,
    },
  },
  {
    // Other model options go here
    sequelize: MySQLConnection, // We need to pass the connection instance
    modelName: "AutoNumber", // We need to choose the model name
    tableName: "gg_auto_numbers",
  }
);

export default AutoNumber;
