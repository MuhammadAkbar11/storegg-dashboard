import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Nominal from "../../models/nominal.model.js";

export const findAllNominal = async filter => {
  try {
    const result = await Nominal.findAll({ ...filter });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findAllNominal");
    throw new TransfromError(error);
  }
};

export const findOneNominal = async filter => {
  try {
    const result = await Nominal.findOne({ ...filter });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findOneNominal");
    throw new TransfromError(error);
  }
};

export const findNominalById = async id => {
  try {
    const result = await Nominal.findByPk(id);
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findOneNominal");
    throw new TransfromError(error);
  }
};

export const createNominal = async data => {
  try {
    const result = await Nominal.create({ ...data });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] createNominal");

    throw new TransfromError(error);
  }
};

export const updateNominal = async (
  id,
  { coin_name, coin_quantity, price, description }
) => {
  try {
    const result = await Nominal.findByPk(id);

    result.coin_name = coin_name;
    result.coin_quantity = coin_quantity;
    result.price = price;
    result.description = description;

    return await result.save();
  } catch (error) {
    Logger.error(error, "[EXCEPTION] updateNominal");
    throw new TransfromError(error);
  }
};

export const deleteNominalById = async filter => {
  try {
    const result = await Nominal.destroy({ ...filter });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] deleteNominalById");
    throw new TransfromError(error);
  }
};
