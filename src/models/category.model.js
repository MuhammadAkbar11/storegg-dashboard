import { DataTypes, Model } from "sequelize";
import MySQLConnection from "../config/db.config.js";
import AutoIncrementField from "../helpers/autoNumberField.helper.js";

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
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
  },
  {
    hooks: {
      beforeBulkCreate: async function (admins, options) {
        for (let i = 0; i < admins.length; i++) {
          const ID = await AutoIncrementField("category_id", "", 7);
          admins[i].dataValues.category_id = ID;
        }
        options.individualHooks = false;
      },
      beforeCreate: async function (admin, options) {
        const ID = await AutoIncrementField("category_id", "", 7);
        admin.dataValues.category_id = ID;
      },
    },
    sequelize: MySQLConnection,
    modelName: "Categories",
    tableName: "gg_categories",
    deletedAt: false,
  }
);

export default Category;
