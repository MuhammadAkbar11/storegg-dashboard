import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class Voucher extends Model {}

Voucher.init(
  {
    voucher_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT(20),
    },
    admin_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
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
      type: DataTypes.INTEGER,
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
