import { MODE } from "../config/env.config.js";
import BaseError from "../helpers/apiError.helper.js";
import { TransfromError } from "../helpers/baseError.helper.js";
import consoleLog from "../utils/consoleLog.js";
import httpStatusCodes from "../utils/httpStatusCode.js";

function logError(err) {
  consoleLog.error(`
[error] : ${err.name} : ${err.message}
          ${err.statusCode} ${err.stack}
`);
}

function logErrorMiddleware(err, req, res, next) {
  logError(err);
  next(err);
}

function return404(req, res, next) {
  const error = new TransfromError(
    new BaseError("BAD_REQUEST", 404, "Page Not Found", false, {
      errorView: "errors/404",
      renderData: {
        title: "Page Not Found",
      },
      responseType: "page",
    })
  );
  return next(error);
}

function returnError(err, req, res, next) {
  const message = err.message;
  const status = err.statusCode || httpStatusCodes.INTERNAL_SERVER;
  const type = req.responseType;
  const stack = MODE == "development" ? err.stack : null;

  if (type == "json") {
    return res.status(status).json({ ...err, stack });
  }

  const view = err?.errorView || "errors/500";
  const errData = {
    message: message,
    ...err,
  };

  const renderData = err?.renderData || { title: message, path: "/error" };

  return res.status(status).render(view, {
    errors: errData,
    ...renderData,
    stack,
  });
}

function isOperationalError(error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

export {
  logError,
  logErrorMiddleware,
  returnError,
  isOperationalError,
  return404,
};
