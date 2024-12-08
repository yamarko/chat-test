import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

export const createChat = async (req, res) => {
  const { fullName } = req.body;
  try {
    const newChat = new Chat({
      receiverFullName: fullName,
      messages: [],
    });

    await newChat.save();

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Failed to create chat" });
  }
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    await Message.deleteMany({ chatId });

    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};

export const updateChat = async (req, res) => {
  const { chatId } = req.params;
  const { fullName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { receiverFullName: fullName },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ message: "Failed to update chat" });
  }
};

export const getChatById = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
};