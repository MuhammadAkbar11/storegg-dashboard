import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

class Administrator extends Model {}

Administrator.init(
  {
    admin_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT(20),
      field: "admin_id",
    },
    user_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "user_id",
    },
  },
  {
    sequelize: ConnectSequelize,
    modelName: "Administrators",
    tableName: "gg_administrators",
    deletedAt: false,
  }
);

export default Administrator;
