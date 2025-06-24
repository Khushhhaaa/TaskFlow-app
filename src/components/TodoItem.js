import React from "react";
import { Card, CardContent, Typography, Checkbox, IconButton, Box, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TodoItem = ({ todo, onToggle, onDelete, onEdit, showEdit }) => (
  <Card sx={{ display: "flex", alignItems: "center", boxShadow: 2, borderRadius: 2, background: "#fff" }}>
    <Checkbox
      checked={todo.completed}
      onChange={onToggle}
      sx={{ color: "#6C5CE7", ml: 1 }}
    />
    <CardContent sx={{ flex: 1, py: 1.5 }}>
      <Typography
        variant="body1"
        sx={{
          textDecoration: todo.completed ? "line-through" : "none",
          color: todo.completed ? "#6C5CE7" : "#222",
          fontWeight: 500,
        }}
      >
        {todo.title}
      </Typography>
    </CardContent>
    {showEdit && (
      <Tooltip title="Edit">
        <IconButton onClick={onEdit} color="primary" aria-label="Edit todo">
          <EditIcon />
        </IconButton>
      </Tooltip>
    )}
    {onDelete && (
      <Box sx={{ pr: 1 }}>
        <Tooltip title="Delete">
          <IconButton onClick={onDelete} color="error" aria-label="Delete todo">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    )}
  </Card>
);

export default TodoItem; 