import express from "express";
import { getMessages, sendMessage, sendAutoReply } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:chatId", getMessages);
router.post("/send", sendMessage);
router.post("/auto-reply", sendAutoReply);

export default router;