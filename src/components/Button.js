import React from "react";
import styles from "./Button.module.css";

const Button = ({ children, className = "", ...props }) => (
  <button className={`${styles.button} ${className}`} {...props}>
    {children}
  </button>
);

export default Button; 