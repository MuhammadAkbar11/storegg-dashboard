import { TransfromError } from "../../helpers/baseError.helper.js";
import BankModel from "./bank.model.js";

export const findAllBank = async () => {
  try {
    const result = await BankModel.find({});
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllBank", error);
    throw new TransfromError(error);
  }
};

export const findBankById = async id => {
  try {
    const result = await BankModel.findById(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneBank", error);
    throw new TransfromError(error);
  }
};

export const createBank = async data => {
  try {
    const result = await BankModel.create(data);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createBank", error);
    throw new TransfromError(error);
  }
};

export const updateBank = async (id, data) => {
  try {
    const result = await BankModel.findByIdAndUpdate(id, { ...data });
    return await result.save();
  } catch (error) {
    console.error("[EXCEPTION] updateBank", error);
    throw new TransfromError(error);
  }
};

export const deleteBankById = async id => {
  try {
    const result = await BankModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteBankById", error);
    throw new TransfromError(error);
  }
};
