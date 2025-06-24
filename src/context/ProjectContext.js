import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../utils';

const ProjectContext = createContext();

const SET_PROJECTS = 'SET_PROJECTS';
const ADD_PROJECT = 'ADD_PROJECT';
const UPDATE_PROJECT = 'UPDATE_PROJECT';
const DELETE_PROJECT = 'DELETE_PROJECT';

const initialState = {
  projects: []
};

function reducer(state, action) {
  switch (action.type) {
    case SET_PROJECTS:
      return { ...state, projects: action.payload };
    case ADD_PROJECT:
      return { ...state, projects: [action.payload, ...state.projects] };
    case UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(p => p._id === action.payload._id ? action.payload : p)
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(p => p._id !== action.payload)
      };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token, loading: authLoading } = useAuth();

  // Fetch all projects on mount or when token changes
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => dispatch({ type: SET_PROJECTS, payload: data }))
      .catch(() => dispatch({ type: SET_PROJECTS, payload: [] }));
  }, [token]);

  const addProject = async (project) => {
    const res = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(project)
    });
    if (res.ok) {
      const newProject = await res.json();
      dispatch({ type: ADD_PROJECT, payload: newProject });
    }
  };

  const updateProject = async (project) => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${project._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(project)
    });
    if (res.ok) {
      const updated = await res.json();
      dispatch({ type: UPDATE_PROJECT, payload: updated });
    }
  };

  const deleteProject = async (projectId) => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      dispatch({ type: DELETE_PROJECT, payload: projectId });
    }
  };

  if (authLoading) return null;

  return (
    <ProjectContext.Provider value={{
      projects: state.projects,
      addProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectContext must be used within a ProjectProvider');
  return ctx;
} 