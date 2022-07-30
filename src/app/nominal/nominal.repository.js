import { TransfromError } from "../../helpers/baseError.helper.js";
import Nominal from "../../models/nominal.model.js";

export const findAllNominal = async filter => {
  try {
    const result = await Nominal.findAll({ ...filter });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllNominal", error);
    throw new TransfromError(error);
  }
};

export const findOneNominal = async filter => {
  try {
    const result = await Nominal.findOne({ ...filter });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneNominal", error);
    throw new TransfromError(error);
  }
};

export const findNominalById = async id => {
  try {
    const result = await Nominal.findByPk(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneNominal", error);
    throw new TransfromError(error);
  }
};

export const createNominal = async data => {
  try {
    const result = await Nominal.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createNominal", error);
    throw new TransfromError(error);
  }
};

export const updateNominal = async (id, { coinName, coinNominal, price }) => {
  try {
    const result = await Nominal.findByPk(id);

    result.coinName = coinName;
    result.coinNominal = coinNominal;
    result.price = price;

    return await result.save();
  } catch (error) {
    console.error("[EXCEPTION] updateNominal", error);
    throw new TransfromError(error);
  }
};

export const deleteNominalById = async filter => {
  try {
    const result = await Nominal.destroy({ ...filter });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteNominalById", error);
    throw new TransfromError(error);
  }
};
