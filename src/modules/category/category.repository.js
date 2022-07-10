import { TransfromError } from "../../helpers/baseError.helper.js";
import CategoryModel from "./category.model.js";

export const findAllCategories = async () => {
  try {
    const data = await CategoryModel.find({});
    return data;
  } catch (error) {
    console.error("[EXCEPTION] findOneUser", error);
    throw new TransfromError(error);
  }
};

export const findCategoryById = async id => {
  try {
    const data = await CategoryModel.findById(id);

    return data;
  } catch (error) {
    console.error("[EXCEPTION] findOneUser", error);
    throw new TransfromError(error);
  }
};

export const createCategory = async data => {
  try {
    const result = await CategoryModel.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createCategory", error);
    throw new TransfromError(error);
  }
};

export const updateCategory = async (id, data) => {
  try {
    const category = await CategoryModel.findById(id);

    category.name = data.name;
    category.description = data.description;

    return await category.save();
  } catch (error) {
    console.error("[EXCEPTION] createCategory", error);
    throw new TransfromError(error);
  }
};

export const deleteCategoryById = async id => {
  try {
    const result = await CategoryModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createCategory", error);
    throw new TransfromError(error);
  }
};
