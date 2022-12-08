import { MODE } from "../config/env.config.js";
import BaseError from "../helpers/apiError.helper.js";
import { TransfromError } from "../helpers/baseError.helper.js";
import Logger from "../helpers/logger.helper.js";
import { httpStatusCodes } from "../constants/index.constants.js";
import chalk from "chalk";

const errorText = chalk.hex("#DA1212");

function logError(err) {
  Logger.error(chalk.red(`[name] : ${err.name}`));
  Logger.error(chalk.red(`[message] : ${err.message}`));
  Logger.error(`${errorText("[stack] : ")} \n${errorText(err.stack)}`);
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
  const stack = MODE !== "production" ? err.stack : null;

  if (type === "json") {
    return res.status(status).json({
      name: err.name,
      message: err.message,
      statusCode: status,
      data: {
        validation: err.validation,
        ...err.data,
      },
      stack,
    });
  }

  if (err.name.includes("ERR_AUTH")) {
    req.logout();
    req.flash("flashdata", {
      type: "danger",
      title: "Failed!",
      message: message,
    });
    res.redirect("/auth");
    return;
  }

  const view = err?.errorView || "errors/500";
  const errData = {
    message: message,
    name: err.name,
    statusCode: status,
    ...err,
  };

  const renderData = err?.renderData || {
    title: `(${status}) ${err.name}`,
    path: "/error",
  };

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
