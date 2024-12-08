import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/sidebar/SideBar";
import useChatStore from "../store/useChatStore";
import toast from "react-hot-toast";

import styles from "./HomePage.module.css"

function HomePage() {
  const location = useLocation();
  const { fetchChats, fetchMessages, chats } = useChatStore();
  const isToastShown = useRef(false);

  useEffect(() => {
    const loadChats = async () => {
      await fetchChats();
      console.log("fetchChats");
      
      if (!isToastShown.current) {
        toast.success("Data loaded successfully!");
        isToastShown.current = true;
      }
    };
    loadChats();
  }, [fetchChats]);

  useEffect(() => {
    if (chats.length > 0) {
      chats.forEach((chat) => {
        console.log("fetchMessages");
        fetchMessages(chat._id);
      });
    }
  }, [chats, fetchMessages]);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <SideBar />
      </div>
      <div className={styles.chat}>
        {location.pathname === "/" ? (
          <h3 className={styles.noChat}>Select a chat to view messages</h3>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

export default HomePage;