import AutoIncrement from "../models/autoIncrement.model.js";
import { TransfromError } from "./baseError.helper.js";
import Logger from "./logger.helper.js";

async function AutoIncrementField(field, customPrefix = "", length = 6) {
  try {
    const table = await AutoIncrement.findOne({
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

    Logger.info(`Done Increment Value = ${result}, Length = ${length} `);
    return result;
  } catch (error) {
    Logger.error(error);
    new TransfromError(error);
  }
}

export default AutoIncrementField;
