class BaseError extends Error {
  constructor(name, statusCode, description, isOperational, data) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.data = data;
    this.description = description;
    this.isOperational = isOperational;
    this.stack;
    this.responseType;
    Error.captureStackTrace(this);
  }

  render(view = "errors/500") {
    this.responseType = "page";
    this.errorView = view;
  }

  json() {
    this.responseType = "json";
  }
}

export default BaseError;
