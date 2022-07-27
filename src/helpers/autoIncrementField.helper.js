import AutoIncrement from "../models/autoIncrement.model.js";
import { TransfromError } from "./baseError.helper.js";
import Logger from "./logger.helper.js";

async function AutoIncrementField(field, customPrefix = "", length = 6) {
  const customPrefixLength = customPrefix.length;

  try {
    await AutoIncrement.increment("value", {
      where: {
        field: field,
      },
    });

    const table = await AutoIncrement.findOne({
      where: {
        field: field,
      },
    });
    let zero = [];

    const defaultPrefix = table.prefix;
    const counter = table.value;

    const num = length - +customPrefixLength - +counter;
    for (let i = 0; i < num; i++) {
      zero.push("0");
    }

    return `${defaultPrefix}${customPrefix}${zero.join("")}${counter}`;
  } catch (error) {
    Logger.error(error);
    new TransfromError(error);
  }
}

export default AutoIncrementField;
