import express from "express";
import { guardarProgreso, obtenerProgreso } from "../controllers/progresoController.js";

const router = express.Router();

router.post("/progreso", guardarProgreso);
router.get("/progreso/:userId", obtenerProgreso);

export default router;