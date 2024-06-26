import { Router } from "express";
import { 
  createTask, 
  createTaskByLabname, 
  deleteTask, 
  getCurrentCompound, 
  getTaskById, 
  getTasksByCategory,
  getTasksByStatus, 
  updateTaskDetails
} from "../controllers/tasks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyTask } from "../middlewares/task.middleware.js";
import { getCurrentLab } from "../middlewares/lab.middleware.js";

const router = Router(); 

router.route("/createTaskByLabname/:username/:labname/:title").post(createTaskByLabname);
//secured Routes
router.route("/createCompound/:labname/:title").post(verifyJWT, getCurrentLab, createTask);
router.route("/deleteTask").delete(verifyJWT,deleteTask);
router.route("/getTasksByCategory").get(verifyJWT,getTasksByCategory);
router.route("/getTaskById").get(verifyJWT,getTaskById);
router.route("/getTasksByStatus").get(verifyJWT,getTasksByStatus);
router.route("/getCurrentTask/:labname/:title").get(verifyJWT, getCurrentLab,verifyTask,getCurrentCompound)
router.route("/updateTaskDetails/:labname/:title").patch(verifyJWT, getCurrentLab, verifyTask,updateTaskDetails)
router.route("/deleteTaskByTitle/:labname/:title").delete(verifyJWT,getCurrentLab,verifyTask,deleteTask)

export default router;