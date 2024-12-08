import express from "express";
import { getChats, createChat, deleteChat, updateChat, getChatById } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", getChats);
router.post("/", createChat);
router.delete("/:chatId", deleteChat);

router.put("/:chatId", updateChat);
router.get("/:chatId", getChatById);

export default router;
