import express from "express";
import appRoutes from "./app.routes.js";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/", appRoutes);
router.use("/auth", authRoutes);

const routers = router;

export default routers;
