
import { TransfromError } from "../../helpers/baseError.helper.js";
import NominalModel from "./nominal.model.js";

export const findAllNominal = async () => {
  try {
    const result = await NominalModel.find({});
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllNominal", error);
    throw new TransfromError(error);
  }
};

export const findNominalById = async id => {
  try {
    const result = await NominalModel.findById(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneNominal", error);
    throw new TransfromError(error);
  }
};

export const createNominal = async data => {
  try {
    const result = await NominalModel.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createNominal", error);
    throw new TransfromError(error);
  }
};

export const updateNominal = async (id, data) => {
  try {
    const result = await NominalModel.findById(id);
    return await result.save();
  } catch (error) {
    console.error("[EXCEPTION] updateNominal", error);
    throw new TransfromError(error);
  }
};

export const deleteNominalById = async id => {
  try {
    const result = await NominalModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteNominalById", error);
    throw new TransfromError(error);
  }
};

