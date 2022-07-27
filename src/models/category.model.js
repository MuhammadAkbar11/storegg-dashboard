import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../config/db.config.js";

class Category extends Model {}

Category.init(
  {
    category_id: {
      primaryKey: true,
      type: DataTypes.STRING(15),
      field: "category_id",
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "name",
    },
    description: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (admins, options) {
        for (let i = 0; i < admins.length; i++) {
          const ID = await AutoIncrementField("category_id", "", 6);
          admins[i].dataValues.category_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (admin, options) {
        const ID = await AutoIncrementField("category_id", "", 6);
        admin.dataValues.category_id = ID;
      },
    },
    sequelize: sequelizeConnection,
    modelName: "Categories",
    tableName: "gg_categories",
    deletedAt: false,
  }
);

export default Category;
