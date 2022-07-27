import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class Bank extends Model {}

Bank.init(
  {
    bank_id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      field: "bank_id",
    },
    account_name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "name",
    },
    bank_name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "bank_name",
    },
    no_rekening: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "no_rekening",
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Banks",
    tableName: "gg_banks",
    deletedAt: false,
  }
);

export default Bank;
