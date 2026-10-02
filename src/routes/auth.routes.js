import express from "express";
import { createUserCtrls } from "../ctrls/auth.ctrl.js";

const router = express.Router();

router.post("/register", createUserCtrls);

export default router;
