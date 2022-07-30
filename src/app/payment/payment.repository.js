import { TransfromError } from "../../helpers/baseError.helper.js";
import PaymentModel from "./payment.model.js";

export const findAllPayment = async () => {
  try {
    const result = await PaymentModel.find({}).populate("banks");
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllPayment", error);
    throw new TransfromError(error);
  }
};

export const findPaymentById = async id => {
  try {
    const result = await PaymentModel.findById(id).populate("banks");
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOnePayment", error);
    throw new TransfromError(error);
  }
};

export const createPayment = async data => {
  try {
    const result = await PaymentModel.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createPayment", error);
    throw new TransfromError(error);
  }
};

export const updatePayment = async (id, data) => {
  try {
    const result = await PaymentModel.findByIdAndUpdate(id, data);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] updatePayment", error);
    throw new TransfromError(error);
  }
};

export const deletePaymentById = async id => {
  try {
    const result = await PaymentModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deletePaymentById", error);
    throw new TransfromError(error);
  }
};

export const updatePaymentStatusById = async id => {
  try {
    let payment = await PaymentModel.findOne({ _id: id });
    payment.status = payment.status === "Y" ? "N" : "Y";
    return await payment.save();
  } catch (error) {
    console.error("[EXCEPTION] updateVoucherStatusById", error);
    throw new TransfromError(error);
  }
};
