
import { TransfromError } from "../../helpers/baseError.helper.js";
import VoucherModel from "./voucher.model.js";

export const findAllVoucher = async () => {
  try {
    const result = await VoucherModel.find({});
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllVoucher", error);
    throw new TransfromError(error);
  }
};

export const findVoucherById = async id => {
  try {
    const result = await VoucherModel.findById(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneVoucher", error);
    throw new TransfromError(error);
  }
};

export const createVoucher = async data => {
  try {
    const result = await VoucherModel.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createVoucher", error);
    throw new TransfromError(error);
  }
};

export const updateVoucher = async (id, data) => {
  try {
    const result = await VoucherModel.findById(id);
    return await result.save();
  } catch (error) {
    console.error("[EXCEPTION] updateVoucher", error);
    throw new TransfromError(error);
  }
};

export const deleteVoucherById = async id => {
  try {
    const result = await VoucherModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteVoucherById", error);
    throw new TransfromError(error);
  }
};

