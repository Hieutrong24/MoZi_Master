import express from "express";
import authController from "../controllers/auth.controller.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.post("/sign-in", authController.signIn);

router.post("/sign-up", authController.signUp);

router.post("/sign-out", authController.signOut);

router.post("/fetch-account", authorize, authController.fetchAccount);

export default router;
