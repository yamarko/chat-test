import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useChatStore from "../../store/useChatStore";
import MessageBlock from "./MessageBlock";
import MessageInput from "./MessageInput";
import toast from "react-hot-toast";

import styles from "./ChatContainer.module.css";

function ChatContainer() {
  const { chatId } = useParams();
  const [typingStatus, setTypingStatus] = useState({});
  const {
    chats,
    messages,
    fetchMessages,
    sendMessage,
    autoReply,
    error,
  } = useChatStore();

  const chat = chats.find((chat) => chat._id === chatId);

  const handleSendMessage = async (text) => {
    try {
      await sendMessage(chatId, text);

      setTypingStatus((prev) => ({
        ...prev,
        [chatId]: true,
      }));

      toast.success("New message sent!");

      setTimeout(async () => {
        await autoReply(chatId);
        setTypingStatus((prev) => ({
          ...prev,
          [chatId]: false,
        }));

        toast.success(
          <span>
            New message from <strong>{chat.receiverFullName}</strong>!
          </span>
        );
      }, 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId, fetchMessages]);

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className={styles.messageBlock}>
        <MessageBlock
          chat={chat}
          messages={messages[chatId] || []}
          isTyping={typingStatus[chatId]}
          activeChatId={chatId}
        />
      </div>
      <div className={styles.messageInput}>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
}

export default ChatContainer;