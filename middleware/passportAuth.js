import passport from "passport";

export const passportAuthLogin = passport.authenticate("local", {
  failureRedirect: "/auth",
  successRedirect: "/dashboard",
  failureFlash: true,
});
