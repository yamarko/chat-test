import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useChatStore = create((set, get) => ({
  chats: [],
  messages: {},
  loading: false,
  error: null,

  fetchChats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/chats");
      const chatData = response.data;
  
      const chatsWithLastMessage = await Promise.all(
        chatData.map(async (chat) => {
          try {
            const response = await axiosInstance.get(`/messages/${chat._id}`);
            const messages = response.data;
            const lastMessage = messages.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )[0];
            return { ...chat, lastMessage: lastMessage ? lastMessage.text : "No messages yet" };
          } catch (err) {
            console.error(`Failed to fetch messages for chat ${chat._id}:`, err);
            return { ...chat, lastMessage: "Failed to load messages" };
          }
        })
      );
  
      set({ chats: chatsWithLastMessage });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchMessages: async (chatId) => {
    try {
      const response = await axiosInstance.get(`/messages/${chatId}`);
      const messages = response.data;
  
      const sortedMessages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: sortedMessages,
        },
      }));
    } catch (err) {
      console.error("Error fetching messages:", err);
      set({ error: err.response?.data?.message || err.message });
    }
  },
  
  updateChatName: async (chatId, newName) => {
    try {
      await axiosInstance.put(`/chats/${chatId}`, { fullName: newName });
  
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === chatId ? { ...chat, receiverFullName: newName } : chat
        ),
      }));
    } catch (err) {
      console.error("Error updating chat:", err);
    }
  },

  deleteChat: async (chatId) => {
    try {
      await axiosInstance.delete(`/chats/${chatId}`);
      
      set((state) => ({
        chats: state.chats.filter((chat) => chat._id !== chatId),
      }));
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  },

  sendMessage: async (chatId, text) => {
    try {
      const response = await axiosInstance.post("/messages/send", {
        chatId,
        text,
      });
      const newMessage = response.data;
  
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat._id === chatId
            ? { ...chat, lastMessage: newMessage.text }
            : chat
        );
        return {
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), newMessage],
          },
          chats: updatedChats,
        };
      });
      return newMessage;
    } catch (err) {
      console.error("Failed to send message:", err);
      throw err;
    }
  },
  
  autoReply: async (chatId) => {
    try {
      const response = await axiosInstance.post("/messages/auto-reply", { chatId });
      const autoMessage = response.data;
  
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat._id === chatId
            ? { ...chat, lastMessage: autoMessage.text }
            : chat
        );
        return {
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), autoMessage],
          },
          chats: updatedChats,
        };
      });
      return autoMessage;
    } catch (err) {
      console.error("Failed to get auto-reply:", err);
      throw err;
    }
  },

  createChat: async (fullName) => {
    try {
      const response = await axiosInstance.post("/chats", { fullName });
      const newChat = response.data;
  
      const updatedNewChat = { ...newChat, lastMessage: "No messages yet" };
  
      set((state) => ({
        chats: [updatedNewChat, ...state.chats],
      }));
  
      return updatedNewChat;
    } catch (error) {
      console.error("Failed to create chat:", error);
      throw error;
    }
  },
}));

export default useChatStore;