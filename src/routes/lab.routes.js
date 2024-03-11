import { Router } from "express";
import { 
    createLab,
    updateLabname,
    getLabByLabname,
    deleteLab
  } from "../controllers/lab.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCurrentLab } from "../middlewares/lab.middleware.js";

const router = Router();


// secured Routes
router.route("/createLab").post(verifyJWT, createLab);
router.route("/updateLabname").patch(verifyJWT, updateLabname);
router.route("/getLabByLabname/:labname").get(verifyJWT, getCurrentLab, getLabByLabname)
router.route("/deleteLabByLabname/:labname").delete(verifyJWT,getCurrentLab,deleteLab)

export default router;

