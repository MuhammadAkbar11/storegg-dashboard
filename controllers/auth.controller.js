export const getLogin = async (req, res) => {
  try {
    res.send("login route");
  } catch (error) {
    throw new Error(error);
  }
};
