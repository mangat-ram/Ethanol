import { Router } from "express";
import { createMol } from "../controllers/mol.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCurrentLab } from "../middlewares/lab.middleware.js";
import { verifyTask } from "../middlewares/task.middleware.js";

const router = Router();

//Secured Routes

router.route("/createMol/:labname/:title/:mol").post(verifyJWT,getCurrentLab,verifyTask,createMol)
// router.route("/getCurrentMol/:labname/:title/:molTitle").post(verifyJWT,getCurrentLab,verifyTask,createMol)

export default router;