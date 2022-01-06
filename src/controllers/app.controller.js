export const getIndex = (req, res) => {
  res.render("index", {
    title: "Welcome",
  });
};

export const getDashboard = (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
  });
};
