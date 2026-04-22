import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../../config/db.config.js";

class Category extends Model {}

Category.init(
  {
    category_id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "category_id",
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "name",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
  },
  {
    sequelize: MySQLConnection,
    modelName: "Categories",
    tableName: "gg_categories",
    deletedAt: false,
  }
);

export default Category;
