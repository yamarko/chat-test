import React, { useState, useEffect } from "react";
import useChatStore from "../../store/useChatStore";
import classes from "./CreateChatDialog.module.css";
import { toast } from "react-hot-toast";

function CreateChatDialog({ isOpen, onClose, selectedChat, onSave }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const createChat = useChatStore((state) => state.createChat);
  const updateChat = useChatStore((state) => state.updateChatName);

  useEffect(() => {
    if (!selectedChat) {
      setFirstName("");
      setLastName("");
    }
  }, [selectedChat, isOpen]);

  useEffect(() => {
    if (selectedChat) {
      const [first, last] = selectedChat.receiverFullName.split(" ");
      setFirstName(first || "");
      setLastName(last || "");
    }
  }, [selectedChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      toast.error("Both first and last names are required.");
      return;
    }

    try {
      const fullName = `${firstName} ${lastName}`;
      if (selectedChat) {
        await updateChat(selectedChat._id, fullName);
      } else {
        await createChat(fullName);
      }
      onClose();
    } catch (err) {
      console.error("Failed to save chat:", err);
      toast.error("Failed to save chat. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={classes.overlay}>
      <div className={classes.dialog}>
        <h3>{selectedChat ? "Edit Chat" : "Create New Chat"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div className={classes.actions}>
            <button type="button" onClick={onClose} className={classes.cancel}>
              Cancel
            </button>
            <button type="submit" className={classes.create}>
              {selectedChat ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChatDialog;