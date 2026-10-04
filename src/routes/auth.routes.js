import express from "express";
import { createUserCtrls, getMe, loginCtrl } from "../ctrls/auth.ctrl.js";
import { authenticate } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/register", createUserCtrls);
router.post("/login", loginCtrl);
router.get("/me", authenticate(), getMe);

export default router;
