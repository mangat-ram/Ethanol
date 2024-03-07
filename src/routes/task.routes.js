import { Router } from "express";
import { 
  createTask, 
  deleteTask, 
  getTaskById, 
  getTasksByCategory,
  getTasksByStatus 
} from "../controllers/tasks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//secured Routes
router.route("/createTask").post(verifyJWT,createTask);
router.route("/deleteTask").delete(verifyJWT,deleteTask);
router.route("/getTasksByCategory").get(verifyJWT,getTasksByCategory);
router.route("/getTaskById").get(verifyJWT,getTaskById);
router.route("/getTasksByStatus").get(verifyJWT,getTasksByStatus);

export default router;