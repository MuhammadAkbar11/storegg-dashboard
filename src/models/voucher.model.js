import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class Voucher extends Model {}

Voucher.init(
  {
    voucher_id: {
      primaryKey: true,
      type: DataTypes.STRING(25),
    },
    admin_id: {
      allowNull: false,
      type: DataTypes.STRING(25),
      field: "admin_id",
    },
    game_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "name",
    },
    game_coin_name: {
      allowNull: false,
      type: DataTypes.STRING(15),
      field: "game_coin_name",
    },
    status: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
      field: "status",
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    category_id: {
      allowNull: true,
      type: DataTypes.STRING(15),
      field: "category_id",
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Vouchers",
    tableName: "gg_vouchers",
  }
);

export default Voucher;
