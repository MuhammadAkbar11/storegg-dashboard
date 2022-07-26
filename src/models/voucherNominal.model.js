import { DataTypes, Model } from "sequelize";
import ConnectSequelize from "../helpers/connect.helper.js";

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
    sequelize: ConnectSequelize,
    modelName: "VoucherNominals",
    tableName: "gg_voucher_nominals",
  }
);

export default VoucherNominal;
