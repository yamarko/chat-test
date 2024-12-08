import axios from "axios";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId).populate("messages");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat.messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const userMessage = new Message({
      chatId: chat._id,
      receiverFullName: chat.receiverFullName,
      text,
      sender: "user",
    });

    await userMessage.save();

    chat.messages.push(userMessage._id);
    chat.updatedAt = Date.now();
    await chat.save();

    res.status(201).json(userMessage);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to add message" });
  }
};

export const sendAutoReply = async (req, res) => {
  const { chatId } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const response = await axios.get("https://zenquotes.io/api/random");
    const quote = response.data[0].q;
    const author = response.data[0].a;

    const autoMessage = new Message({
      chatId: chat._id,
      receiverFullName: chat.receiverFullName,
      text: `${quote} - ${author}`,
      sender: "bot",
    });

    await autoMessage.save();

    chat.messages.push(autoMessage._id);
    chat.updatedAt = Date.now();
    await chat.save();

    res.status(201).json(autoMessage);
  } catch (error) {
    console.error("Error sending auto-reply:", error);
    res.status(500).json({ message: "Failed to send auto-reply" });
  }
};