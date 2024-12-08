import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./ChatSearch.module.css";

function ChatSearch({ chats }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const results = chats.filter((chat) =>
        chat.receiverFullName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChats(results);
    } else {
      setFilteredChats([]);
    }
  };

  const handleSelectChat = (chatId) => {
    navigate(`/chat/${chatId}`);
    setSearchQuery("");
    setFilteredChats([]);
  };

  return (
    <div className={classes.searchContainer}>
      <input
        type="text"
        placeholder="Search chats..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className={classes.searchInput}
      />
      {filteredChats.length > 0 && (
        <ul className={classes.searchResults}>
          {filteredChats.map((chat) => (
            <li
              key={chat._id}
              onClick={() => handleSelectChat(chat._id)}
              className={classes.searchResultItem}
            >
              {chat.receiverFullName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatSearch;
