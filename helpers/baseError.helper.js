class BaseError extends Error {
  constructor(
    name,
    statusCode,
    description,
    isOperational = true,
    errors = {}
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;
    this.description = description;
    this.isOperational = isOperational;
    this.stack;
    this.responseType = "page";
    Object.keys(errors).map(err => {
      this[err] = errors[err];
    });
    Error.captureStackTrace(this);
  }

  validation(errors) {
    let errorObj = {};
    const newArrError = [...errors];
    for (var i = 0, len = newArrError.length; i < len; i++) {
      const messageArr = errors
        .filter(item => item.param == newArrError[i]["param"])
        .map(el => el.msg);
      errorObj[newArrError[i]["param"]] = {
        type: newArrError[i]["param"],
        message: messageArr,
      };
    }

    for (var key in errorObj) newArrError.push(errorObj[key]);
    console.log(errorObj, "class");
    this.validation = errorObj;
  }
}

export default BaseError;
