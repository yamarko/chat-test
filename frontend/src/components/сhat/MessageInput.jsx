import React, { useState } from "react";
import classes from "./MessageInput.module.css";

function MessageInput({ onSendMessage }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.messageInputForm}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className={classes.messageInput}
      />
      <button
        type="submit"
        className={classes.sendButton}
        disabled={!text.trim()}
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
