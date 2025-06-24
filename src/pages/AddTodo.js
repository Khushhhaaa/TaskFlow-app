import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoItem from "../components/TodoItem";
import Button from "../components/Button";
import styles from "./AddTodo.module.css";

const TODOS_KEY = "todos";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    setError("");
    const newTodo = {
      id: Date.now(),
      title,
      completed,
    };
    const saved = localStorage.getItem(TODOS_KEY);
    const todos = saved ? JSON.parse(saved) : [];
    todos.unshift(newTodo);
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    navigate("/");
  };

  return (
    <div className={styles.addTodoContainer}>
      <h2>Add Todo</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          className={styles.input}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className={styles.checkbox}
          />
          Completed
        </label>
        <Button type="submit">Add</Button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default AddTodo; 