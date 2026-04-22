function responseType(req, _res, next) {
  const url = req.originalUrl;

  if (url.substr(0, 4) == "/api") {
    req.responseType = "json";
  } else {
    req.responseType = "page";
  }
  next();
}

export { responseType };
