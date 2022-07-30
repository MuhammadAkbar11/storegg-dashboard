import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../../config/db.config.js";

class Administrator extends Model {}

Administrator.init(
  {
    admin_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT(25),
      field: "admin_id",
    },
    user_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "user_id",
    },
    phone_number: {
      type: DataTypes.STRING,
      field: "phone_number",
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Administrators",
    tableName: "gg_administrators",
    deletedAt: false,
  }
);

export default Administrator;
