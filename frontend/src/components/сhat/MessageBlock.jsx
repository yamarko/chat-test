import React from "react";
import Avatar from "..//Avatar";
import styles from "./MessageBlock.module.css";

function MessageBlock({ chat, messages, isTyping }) {
  return (
    <>
      {chat && (
        <div className={styles.chatHeader}>
          <Avatar chatName={chat.receiverFullName} />
          {chat.receiverFullName}
        </div>
      )}
      <div className={styles.messagesWrapper}>
        {messages.length === 0 ? (
          <h3 className={styles.noMessages}>No messages in this chat yet</h3>
        ) : (
          messages.map((message) => (
            <React.Fragment key={message._id}>
              <div
                key={message._id}
                className={`${styles.message} ${
                  message.sender === "bot" ? styles.bot : styles.user
                }`}
              >
                <p>{message.text}</p>
              </div>
              <p
                className={`${styles.messageTimestamp} ${
                  message.sender === "bot"
                    ? styles.leftAlign
                    : styles.rightAlign
                }`}
              >
                {new Date(message.createdAt).toLocaleString("uk-UA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </React.Fragment>
          ))
        )}
        {isTyping && (
          <div className={styles.typingIndicator}>{chat.receiverFullName} is typing...</div>
        )}
      </div>
    </>
  );
}

export default MessageBlock;