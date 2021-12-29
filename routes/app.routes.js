import express from "express";
import { getIndex } from "../controllers/app.controller.js";

const router = express.Router();

router.get("/", getIndex);

const appRoutes = router;

export default appRoutes;
