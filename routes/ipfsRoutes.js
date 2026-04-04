import express from "express";
import { uploadData } from "../controllers/ipfsController.js";

const router = express.Router();

router.post("/upload", uploadData);

export default router;