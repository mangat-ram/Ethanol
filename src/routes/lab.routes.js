import { Router } from "express";
import { 
    createLab,
    updateLabname
  } from "../controllers/lab.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// secured Routes
router.route("/createLab").post(verifyJWT, createLab);
router.route("/updateLabname").patch(verifyJWT, updateLabname);

export default router;

