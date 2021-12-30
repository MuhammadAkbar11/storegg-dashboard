import { MODE } from "../config/env.config.js";
import BaseError from "../utils/BaseError.js";
import consoleLog from "../utils/consoleLog.js";

function logError(err) {
  consoleLog.error(`
[error] : ${err.name} : ${err.description}
          ${err.statusCode} ${err.stack}
`);
}

function logErrorMiddleware(err, req, res, next) {
  logError(err);
  next(err);
}

function returnError(err, req, res, next) {
  const type = err.responseType;
  if (type == "json") {
    return res
      .status(err.statusCode || 500)
      .json({ ...err, stack: MODE == "development" ? err.stack : null });
  } else if (type == "page") {
    return res.render(err.errorView, {
      title: err.description,
      ...err,
    });
  } else {
    res
      .status(err.statusCode || 500)
      .json({ ...err, stack: MODE == "development" ? err.stack : null });
  }
}

function isOperationalError(error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

export { logError, logErrorMiddleware, returnError, isOperationalError };
