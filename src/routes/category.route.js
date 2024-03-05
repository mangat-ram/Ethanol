import { Router } from "express";
import { 
  createCategory, 
  deleteCategory, 
  getAllCategory, 
  updateCategory 
} from "../controllers/category.controller.js";

const router = Router();

router.route("/createCategory").post(createCategory);
router.route("/getAllCategory").get(getAllCategory);
router.route("/updateCategory").put(updateCategory);
router.route("/deleteCategory").delete(deleteCategory);
export default router;