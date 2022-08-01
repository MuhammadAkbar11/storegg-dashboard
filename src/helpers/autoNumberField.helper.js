import AutoNumber from "../models/autoNumber.model.js";
import { TransfromError } from "./baseError.helper.js";
import Logger from "./logger.helper.js";

async function AutoNumberField(field, customPrefix = "", length = 6) {
  try {
    const table = await AutoNumber.findOne({
      where: {
        field: field,
      },
    });
    let zero = [];

    const prefix = `${table.prefix}${customPrefix}`;
    const counter = +table.value;
    const prefixLength = prefix.length;
    const num = length - +prefixLength - counter.toString().length;
    for (let i = 0; i < num; i++) {
      zero.push("0");
    }

    const result = `${prefix}${zero.join("")}${counter}`;

    await table.increment("value");

    Logger.info(
      `[HELPER] Auto number done!, Value = ${result}, Length = ${length} `
    );
    return result;
  } catch (error) {
    Logger.error(error);
    new TransfromError(error);
  }
}

export default AutoNumberField;
