export const getLogin = async (req, res) => {
  try {
    res.render("auth/login", {
      title: "Login",
    });
  } catch (error) {
    throw new Error(error);
  }
};
