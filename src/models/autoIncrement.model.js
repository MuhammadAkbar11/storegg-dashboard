import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class AutoIncrement extends Model {}

AutoIncrement.init(
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
    attribute: {
      type: DataTypes.STRING(20),
      field: "attribute",
      defaultValue: "attribute_name",
    },
    prefix: {
      type: DataTypes.STRING(25),
      field: "prefix",
      defaultValue: "prefix",
    },
    zero: {
      type: DataTypes.STRING(10),
      field: "zero",
      defaultValue: "000",
    },
    increment: {
      type: DataTypes.BIGINT(20),
      field: "increment",
      defaultValue: 0,
    },
  },
  {
    // Other model options go here
    sequelize: ConnectSequelize, // We need to pass the connection instance
    modelName: "AutoIncrements", // We need to choose the model name
    tableName: "gg_auto_increments",
  }
);

export default AutoIncrement;
