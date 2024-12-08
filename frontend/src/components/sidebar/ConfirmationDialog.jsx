import React from "react";
import styles from './ConfirmationDialog.module.css';

function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h3>Confirm Deletion</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>Cancel</button>
          <button onClick={onConfirm} className={styles.confirmButton}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;