import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("tess");
  res.send("Hayyy");
});

const appRoutes = router;

export default appRoutes;
