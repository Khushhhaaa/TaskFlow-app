import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../utils';

// Task priority levels with corresponding colors
export const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: '#808080',
  [PRIORITY.MEDIUM]: '#F9A825',
  [PRIORITY.HIGH]: '#E53935'
};

const TaskContext = createContext();

// Action types
const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';
const TOGGLE_TASK = 'TOGGLE_TASK';
const SET_TASKS = 'SET_TASKS';

// Initial state
const initialState = {
  tasks: []
};

// Reducer function
function taskReducer(state, action) {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? { ...task, ...action.payload } : task
        )
      };
    
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload)
      };
    
    case TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        )
      };

    case SET_TASKS:
      return {
        ...state,
        tasks: action.payload
      };
    
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { token, loading: authLoading } = useAuth();

  // Fetch tasks from backend on mount or when token changes
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        dispatch({ type: SET_TASKS, payload: data });
      })
      .catch(() => {
        dispatch({ type: SET_TASKS, payload: [] });
      });
  }, [token]);

  // Add task via backend
  const addTask = async (task) => {
    const payload = {
      ...task,
      status: 'To Do',
      completed: false,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newTask = await res.json();
        dispatch({ type: ADD_TASK, payload: newTask });
        return newTask;
      } else {
        const errorData = await res.json().catch(() => ({}));
        return { error: errorData.error || errorData.message || 'Failed to add task' };
      }
    } catch (err) {
      return { error: err.message || 'Failed to add task' };
    }
  };

  // Update task via backend
  const updateTask = async (task) => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(task)
    });
    if (res.ok) {
      const updated = await res.json();
      dispatch({ type: UPDATE_TASK, payload: updated });
    }
  };

  // Delete task via backend
  const deleteTask = async (taskId) => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      dispatch({ type: DELETE_TASK, payload: taskId });
    }
  };

  // Toggle completed status
  const toggleTask = async (taskId) => {
    dispatch({ type: TOGGLE_TASK, payload: taskId });
    const task = state.tasks.find(t => t._id === taskId);
    if (!task) return;
    const nowCompleted = !task.completed;
    const updatedTask = {
      ...task,
      completed: nowCompleted,
      status: nowCompleted ? 'Done' : 'To Do',
      title: task.title,
      notes: task.notes,
      dueDate: task.dueDate,
      projectId: task.projectId,
      labels: task.labels,
      priority: task.priority,
      subtasks: task.subtasks,
      reminder: task.reminder,
      recurrence: task.recurrence,
    };
    const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedTask)
    });
    if (!res.ok) {
      dispatch({ type: TOGGLE_TASK, payload: taskId });
      alert('Failed to update task status. Please try again.');
      return;
    }
    // Recurring logic: if just completed and has recurrence, create next instance
    if (!task.completed && task.recurrence && updatedTask.completed) {
      let nextDueDate = null;
      let nextReminder = null;
      if (task.dueDate) {
        const due = new Date(task.dueDate);
        switch (task.recurrence) {
          case 'daily':
            due.setDate(due.getDate() + 1);
            break;
          case 'weekly':
            due.setDate(due.getDate() + 7);
            break;
          case 'monthly':
            due.setMonth(due.getMonth() + 1);
            break;
          case 'yearly':
            due.setFullYear(due.getFullYear() + 1);
            break;
          default:
            break;
        }
        nextDueDate = due.toISOString();
      }
      if (task.reminder) {
        const rem = new Date(task.reminder);
        switch (task.recurrence) {
          case 'daily':
            rem.setDate(rem.getDate() + 1);
            break;
          case 'weekly':
            rem.setDate(rem.getDate() + 7);
            break;
          case 'monthly':
            rem.setMonth(rem.getMonth() + 1);
            break;
          case 'yearly':
            rem.setFullYear(rem.getFullYear() + 1);
            break;
          default:
            break;
        }
        nextReminder = rem.toISOString();
      }
      const nextTask = {
        ...task,
        completed: false,
        status: 'To Do',
        dueDate: nextDueDate,
        reminder: nextReminder,
      };
      delete nextTask._id;
      await addTask(nextTask);
    }
  };

  // Filter functions
  const getInboxTasks = () => {
    return state.tasks.filter(task => !task.projectId);
  };

  const getTodayTasks = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return state.tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.slice(0, 10) === todayStr && !task.completed;
    });
  };

  const getProjectTasks = (projectId) => {
    return state.tasks.filter(task => task.projectId === projectId);
  };

  // Group tasks by date
  const groupTasksByDate = (tasks) => {
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 86400000).toDateString();

    return tasks.reduce((groups, task) => {
      if (!task.dueDate) {
        groups.noDueDate.push(task);
      } else {
        const taskDate = new Date(task.dueDate).toDateString();
        if (taskDate === today) {
          groups.today.push(task);
        } else if (taskDate === tomorrow) {
          groups.tomorrow.push(task);
        } else if (taskDate < today) {
          groups.overdue.push(task);
        } else {
          groups.upcoming.push(task);
        }
      }
      return groups;
    }, {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
      noDueDate: []
    });
  };

  const value = {
    tasks: state.tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getInboxTasks,
    getTodayTasks,
    getProjectTasks,
    groupTasksByDate
  };

  if (authLoading) return null;

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
} 