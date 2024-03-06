import { Router } from "express";
import { createLab } from "../controllers/lab.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

const createLabHandler = async (req, res) => {
  try {
    // Extract labName from request body
    const { labName } = req.body;
    // Access userId from request object (attached by middleware)
    const userId = req.userId;

    // Now you have userId, you can associate the lab with this user when creating
    // the lab in your controller
    await createLab({ labName, userId });

    res.status(201).json({ success: true, message: 'Lab created successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// secured Routes
router.route("/createLab").post(verifyJWT, createLabHandler);

export default router;

