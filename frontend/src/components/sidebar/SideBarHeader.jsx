import React from "react";
import { toast } from "react-hot-toast";
import Avatar from "../Avatar";
import styles from "./SideBarHeader.module.css";

function SideBarHeader({ chatName }) {
  const handleToastClick = () => {
    toast.error("Error! Under development.");
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.avatarWrapper} onClick={handleToastClick}>
        <Avatar chatName={chatName} />
      </div>
      <div className={styles.loginButtonWrapper}>
        <button className={styles.loginButton} onClick={handleToastClick}>
          Login
        </button>
      </div>
    </div>
  );
}

export default SideBarHeader;

