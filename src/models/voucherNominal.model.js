import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class VoucherNominal extends Model {}

VoucherNominal.init(
  {
    voucher_nominal_id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      field: "voucher_nominal_id",
    },
    nominal_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "nominal_id",
    },
    voucher_id: {
      allowNull: false,
      type: DataTypes.BIGINT(20),
      field: "voucher_id",
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "VoucherNominals",
    tableName: "gg_voucher_nominals",
  }
);

export default VoucherNominal;
