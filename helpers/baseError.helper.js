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
}

export default BaseError;
