import { Router } from "express";
import { createLab } from "../controllers/lab.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// secured Routes
router.route("/createLab").post(verifyJWT, createLab);

export default router;

