import passport from "passport";

export const passportAuthLogin = passport.authenticate("local", {
  failureRedirect: "/auth",
  successRedirect: "/dashboard",
  failureFlash: true,
});

export const passportAuthGoogleLogin = passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
});

export const passportAuthGoogleLoginCallback = passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
  failureRedirect: "/auth",
});
