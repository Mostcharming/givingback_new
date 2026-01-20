import express from "express";
import { secureLogin } from "../../middleware/auth";
import { createProject } from "./project.controller";

const router = express.Router();

// Create a new project (secured route)
router.post("/", secureLogin, createProject);

export default router;
