import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Category from "../../models/category.model.js";

export const findAllCategories = async filter => {
  try {
    const data = await Category.findAll({ ...filter });
    return data;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findAllCategories");
    throw new TransfromError(error);
  }
};

export const findCategoryById = async id => {
  try {
    const data = await Category.findByPk(id);
    return data;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findCategoryById");
    throw new TransfromError(error);
  }
};

export const createCategory = async data => {
  try {
    const result = await Category.create({ ...data });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] createCategory");
    throw new TransfromError(error);
  }
};

export const updateCategory = async (id, data) => {
  try {
    const category = await Category.findByPk(id);

    category.name = data.name;
    category.description = data.description;

    return await category.save();
  } catch (error) {
    Logger.error(error, "[EXCEPTION] updateCategory");
    throw new TransfromError(error);
  }
};

export const deleteCategoryById = async id => {
  try {
    const result = await Category.destroy({
      where: {
        category_id: id,
      },
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] deleteCategoryById");
    throw new TransfromError(error);
  }
};
