import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("tess");
  res.send("Auth here");
});

const authRoutes = router;

export default authRoutes;
