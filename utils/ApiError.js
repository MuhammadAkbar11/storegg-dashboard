import BaseError from "./BaseError.js";
import httpStatusCodes from "./httpStatusCode.js";

class Api404Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    description = "Not found.",
    isOperational = true,
    // typeResponse = json
    data = null
  ) {
    super(name, statusCode, isOperational, description, data);
  }
}

export default Api404Error;
