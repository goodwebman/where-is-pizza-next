import { Router } from "express";
import { register, login, logout, session } from "../controllers/auth-controller";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post('/logout', logout);
router.get("/session", session);

export default router;
