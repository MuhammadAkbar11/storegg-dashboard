import BaseError from "./baseError.helper.js";
import httpStatusCodes from "../utils/httpStatusCode.js";

class ApiError extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    message = "Not found.",
    isOperational = true,
    errors = {}
  ) {
    super(name, statusCode, message, isOperational, errors);
    this.responseType = "json";
  }
}

export default ApiError;
