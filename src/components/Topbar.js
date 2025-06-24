import React from "react";
import styles from "./Topbar.module.css";
import { FaBell, FaUserCircle, FaPlus } from "react-icons/fa";

const Topbar = ({ onAddTask }) => (
  <header className={styles.topbar}>
    <div className={styles.left}>
      <button className={styles.quickAdd} onClick={onAddTask} title="Add Task">
        <FaPlus /> Add Task
      </button>
    </div>
    <div className={styles.right}>
      <FaBell className={styles.icon} title="Notifications" />
      <FaUserCircle className={styles.avatar} title="User Profile" />
      <span className={styles.username}>Khushi</span>
    </div>
  </header>
);

export default Topbar; 