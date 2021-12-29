import express from "express";
import { getLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", getLogin);

const authRoutes = router;

export default authRoutes;
