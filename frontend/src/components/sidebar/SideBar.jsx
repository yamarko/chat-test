import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContextMenu from "./ContextMenu";
import ChatSearch from "./ChatSearch";
import CreateChatDialog from "./CreateChatDialog";
import useChatStore from "../../store/useChatStore";
import Avatar from "../Avatar";
import SideBarHeader from "./SideBarHeader";
import ConfirmationDialog from "./ConfirmationDialog";

import classes from "./SideBar.module.css";

function SideBar() {
  const { chats, error, updateChatName, deleteChat } = useChatStore();
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const navigate = useNavigate();

  const handleContextMenu = (e, chat) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
    setSelectedChat(chat);
  };

  const handleDeleteChat = (chat) => {
    setChatToDelete(chat);
    setIsConfirmationDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteChat(chatToDelete._id);
    setIsConfirmationDialogOpen(false);
    navigate("/");
  };

  const cancelDelete = () => {
    setIsConfirmationDialogOpen(false);
  };

  return (
    <>
      <SideBarHeader chatName="User" />
      <ChatSearch chats={chats} />
      <div className={classes.newChatHeader}>
        <h2>Chats</h2>
        <button
          onClick={() => {
            setSelectedChat(null);
            setIsDialogOpen(true);
          }}
          className={classes.createChatButton}
        >
          New Chat
        </button>
      </div>
      {error && <p className={classes.errorMessage}>{error}</p>}
      <ul className={classes.chatList}>
        {chats.map((chat) => (
          <li
            key={chat._id}
            className={`${classes.chatItem} ${
              selectedChat && selectedChat._id === chat._id
                ? classes.selected
                : ""
            }`}
            onContextMenu={(e) => handleContextMenu(e, chat)}
            onClick={() => setSelectedChat(chat)}
          >
            <Link to={`/chat/${chat._id}`} className={classes.chatItemLink}>
              <div className={classes.chatBlock}>
                <div className={classes.avatar}>
                  <Avatar chatName={chat.receiverFullName} />
                </div>
                <div className={classes.chatInfo}>
                  <strong>{chat.receiverFullName}</strong>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {contextMenuPosition && selectedChat && (
        <ContextMenu
          chat={selectedChat}
          onEdit={() => {
            setIsDialogOpen(true);
          }}
          onDelete={() => handleDeleteChat(selectedChat)}
          position={contextMenuPosition}
          closeMenu={() => setContextMenuPosition(null)}
        />
      )}
      <CreateChatDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedChat={selectedChat}
      />
      {isConfirmationDialogOpen && (
        <ConfirmationDialog
          message="Are you sure you want to delete this chat?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}

export default SideBar;
