import React, { useEffect, useRef } from "react";
import styles from './ContextMenu.module.css';

function ContextMenu({ chat, onEdit, onDelete, position, closeMenu }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  const handleEdit = () => {
    onEdit(chat);
    closeMenu();
  };

  const handleDelete = () => {
    onDelete(chat);
    closeMenu();
  };

  return (
    <div ref={menuRef} className={styles.contextMenu} style={{ top: position.y, left: position.x }}>
      <div onClick={handleEdit} className={styles.contextMenuItem}>
        Edit Chat
      </div>
      <div onClick={handleDelete} className={styles.contextMenuItemDelete}>
        Delete Chat
      </div>
    </div>
  );
}

export default ContextMenu;