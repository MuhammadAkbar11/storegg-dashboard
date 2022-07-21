import { TransfromError } from "../../helpers/baseError.helper.js";
import TransactionModel from "./transaction.model.js";

export const findAllTransaction = async () => {
  try {
    const result = await TransactionModel.find({}).populate("player");
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllTransaction", error);
    throw new TransfromError(error);
  }
};

export const findTransactionById = async id => {
  try {
    const result = await TransactionModel.findById(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneTransaction", error);
    throw new TransfromError(error);
  }
};

export const createTransaction = async data => {
  try {
    const result = await TransactionModel.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createTransaction", error);
    throw new TransfromError(error);
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const result = await TransactionModel.findByIdAndUpdate(id, data);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] updateTransaction", error);
    throw new TransfromError(error);
  }
};

export const deleteTransactionById = async id => {
  try {
    const result = await TransactionModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteTransactionById", error);
    throw new TransfromError(error);
  }
};

export const updateTransactionStatusById = async (id, statusData) => {
  try {
    let payment = await TransactionModel.findOne({ _id: id });
    payment.status = statusData;
    return await payment.save();
  } catch (error) {
    console.error("[EXCEPTION] updateTransactionStatusById", error);
    throw new TransfromError(error);
  }
};
