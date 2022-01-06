function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/auth");
  }
}

function ensureGuest(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    next();
  }
}

export { ensureAuth, ensureGuest };
