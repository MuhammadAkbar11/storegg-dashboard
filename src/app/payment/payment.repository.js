import MySQLConnection from "../../config/db.config.js";
import { TransfromError } from "../../helpers/baseError.helper.js";
import Logger from "../../helpers/logger.helper.js";
import Bank from "../../models/bank.model.js";
import PaymentMethod from "../../models/paymentMethod.model.js";

export const findAllPayment = async filter => {
  try {
    const result = await PaymentMethod.findAll({
      ...filter,
      include: [
        {
          model: Bank,
          as: "banks",
          attributes: ["bank_id", "account_name", "bank_name", "no_rekening"],
          through: { attributes: [] },
        },
      ],
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findAllPayment");
    throw new TransfromError(error);
  }
};

export const findPaymentById = async id => {
  try {
    const result = await PaymentMethod.findByPk(id, {
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
      include: [
        {
          model: Bank,
          as: "banks",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
          through: {
            attributes: [],
          },
        },
      ],
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] findOnePayment");
    throw new TransfromError(error);
  }
};

export const createPayment = async (data, bank) => {
  const t = await MySQLConnection.transaction();
  try {
    const result = await PaymentMethod.create({ ...data }, { transaction: t });

    await result.addBank(bank, {
      through: {
        self_granted: true,
      },
      transaction: t,
    });

    await t.commit();

    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] createPayment");
    await t.rollback();
    throw new TransfromError(error);
  }
};

export const updatePayment = async (id, data) => {
  const t = await MySQLConnection.transaction();
  const { type, newBanks, oldBanks } = data;
  try {
    const paymentMethod = await findPaymentById(id);

    paymentMethod.type = type;

    if (oldBanks.length !== 0) {
      for (const ob of oldBanks) {
        await paymentMethod.removeBank(ob, {
          through: {
            self_granted: true,
          },
          transaction: t,
        });
      }
    }

    if (newBanks.length !== 0) {
      for (const nb of newBanks) {
        await paymentMethod.addBank(nb, {
          through: {
            self_granted: true,
          },
          transaction: t,
        });
      }
    }
    const result = await paymentMethod.save({ transaction: t });

    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    console.error("[EXCEPTION] updatePayment", error);
    throw new TransfromError(error);
  }
};

export const deletePaymentById = async id => {
  try {
    const result = await PaymentMethod.destroy({
      where: {
        payment_method_id: id,
      },
    });
    return result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] deletePaymentById");
    throw new TransfromError(error);
  }
};

export const updatePaymentStatusById = async id => {
  try {
    let payment = await PaymentMethod.findOne({
      where: {
        payment_method_id: id,
      },
    });

    const status = payment.status === "Y" ? "N" : "Y";

    const result = await PaymentMethod.update(
      {
        status: status,
      },
      {
        where: {
          payment_method_id: id,
        },
      }
    );
    return await result;
  } catch (error) {
    Logger.error(error, "[EXCEPTION] updateVoucherStatusById");
    throw new TransfromError(error);
  }
};
