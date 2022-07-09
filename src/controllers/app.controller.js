export const getIndex = (req, res) => {
  res.render("index", {
    title: "Welcome",
    path: "/",
  });
};
