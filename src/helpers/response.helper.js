import httpStatusCodes from "../utils/httpStatusCode.js";

const ResponseHelper = async (
  res,
  code = httpStatusCodes.BAD_REQUEST,
  message,
  resType = "json",
  data,
  meta = { view: "errors/500" }
) => {
  const { responseReff } = res.app.locals;
  const response = {
    code,
    message,
    data,
    meta,
    responseReff,
  };

  if (resType == "json") {
    return res.status(code).json(response);
  }

  const view = meta.view ?? "errors/500";
  if (!data.title) data.title = message;

  Object.keys(response.data).map(x => {
    response[x] = data[x];
  });

  delete response.data;

  res.status(code).render(view, response);
};

export function ResponseValidation(errors) {
  let errorObj = {};
  const newArrError = [...errors];
  for (let i = 0, len = newArrError.length; i < len; i++) {
    const messageArr = errors
      .filter(item => item.param == newArrError[i]["param"])
      .map(el => el.msg);
    errorObj[newArrError[i]["param"]] = {
      type: newArrError[i]["param"],
      message: messageArr,
    };
  }

  for (let key in errorObj) newArrError.push(errorObj[key]);

  return errorObj;
}

export default ResponseHelper;
