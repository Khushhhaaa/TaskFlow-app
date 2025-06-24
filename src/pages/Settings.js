import React, { useRef } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useTaskContext } from '../context/TaskContext';

function tasksToCSV(tasks) {
  const header = ['Title', 'Notes', 'Due Date', 'Priority', 'Project', 'Labels'];
  const rows = tasks.map(task => [
    '"' + (task.title || '').replace(/"/g, '""') + '"',
    '"' + (task.notes || '').replace(/"/g, '""') + '"',
    '"' + (task.dueDate || '') + '"',
    '"' + (task.priority || '') + '"',
    '"' + (task.projectId || '') + '"',
    '"' + (Array.isArray(task.labels) ? task.labels.join(',') : '') + '"',
  ]);
  return [header.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function parseCSV(text) {
  // Simple CSV parser for this structure
  const lines = text.trim().split(/\r?\n/);
  const [header, ...rows] = lines;
  return rows.map(line => {
    const cols = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s => s.replace(/^"|"$/g, ''));
    return {
      title: cols[0],
      notes: cols[1],
      dueDate: cols[2],
      priority: cols[3],
      projectId: cols[4],
      labels: cols[5] ? cols[5].split(',') : [],
    };
  });
}

const Settings = () => {
  const { tasks, addTask } = useTaskContext();
  const fileInputRef = useRef();

  const handleExport = () => {
    const csv = tasksToCSV(tasks);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const importedTasks = parseCSV(text);
      for (const task of importedTasks) {
        await addTask(task);
      }
      alert('Tasks imported!');
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ mt: 6, textAlign: "center" }}>
      <Typography variant="h4" fontWeight={700} color="#6C5CE7">
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" mt={2} mb={4}>
        User settings will appear here.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleExport}>
          Export Tasks (CSV)
        </Button>
        <Button variant="outlined" component="label">
          Import Tasks (CSV)
          <input
            type="file"
            accept=".csv"
            hidden
            ref={fileInputRef}
            onChange={handleImport}
          />
        </Button>
      </Stack>
    </Box>
  );
};

export default Settings; 