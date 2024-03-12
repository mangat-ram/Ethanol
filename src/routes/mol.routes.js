import { Router } from "express";
import { 
  createMol, 
  getMolByTitle
} from "../controllers/mol.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCurrentLab } from "../middlewares/lab.middleware.js";
import { verifyTask } from "../middlewares/task.middleware.js";
import { getCurrentMol } from "../middlewares/mol.middleware.js";

const router = Router();

//Secured Routes

router.route("/createMol/:labname/:title").post(verifyJWT,getCurrentLab,verifyTask,createMol);
router.route("/getMolByTitle/:labname/:title/:mol").post(verifyJWT, getCurrentLab, verifyTask,getCurrentMol,getMolByTitle)

export default router;