import { TransfromError } from "../../helpers/baseError.helper.js";
import Bank from "../../models/bank.model.js";

export const findAllBank = async (
  filter = {
    where: {},
  }
) => {
  try {
    const result = await Bank.findAll({ ...filter });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findAllBank", error);
    throw new TransfromError(error);
  }
};

export const findBankById = async id => {
  try {
    const result = await Bank.findByPk(id);
    return result;
  } catch (error) {
    console.error("[EXCEPTION] findOneBank", error);
    throw new TransfromError(error);
  }
};

export const createBank = async data => {
  try {
    const result = await Bank.create({ ...data });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] createBank", error);
    throw new TransfromError(error);
  }
};

export const updateBank = async (id, data) => {
  try {
    const result = await Bank.update(
      {
        ...data,
      },
      {
        where: {
          bank_id: id,
        },
      }
    );
    return result;
  } catch (error) {
    console.error("[EXCEPTION] updateBank", error);
    throw new TransfromError(error);
  }
};

export const deleteBankById = async id => {
  try {
    const result = await Bank.destroy({
      where: {
        bank_id: id,
      },
    });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] deleteBankById", error);
    throw new TransfromError(error);
  }
};
