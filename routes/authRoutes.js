import express from "express";
import { adminLogin, createAdmin } from "../controllers/authController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Login
router.post("/login", adminLogin);

// ⚠️ One-time admin create (disable/remove after first use or protect by secret)
// router.post("/seed", createAdmin);

router.get("/me", protectAdmin, (req, res) => {
  res.json({ ok: true, admin: req.admin });
});

export default router;
