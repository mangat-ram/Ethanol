import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  updateAccountDetails,
  changeCurrentPassword,
  refreshAccessToken, 
  getCurrentUser,
  checkUniqueUser
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/checkUniqueUser/:userName").get(checkUniqueUser);

//Secured Routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refreshToken").post(verifyJWT,refreshAccessToken);
router.route("/changePassword").post(verifyJWT,changeCurrentPassword);
router.route("/getUser").get(verifyJWT,getCurrentUser);
router.route("/updateDetails").patch(verifyJWT,updateAccountDetails);
export default router;