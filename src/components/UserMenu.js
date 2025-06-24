import React from "react";
import { Avatar, Button, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AUTH_KEY = "authUser";

const UserMenu = ({ onSignOut }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = () => {
    handleClose();
    onSignOut();
  };

  if (!user) return null;

  return (
    <>
      <IconButton onClick={handleMenu} color="inherit" size="large">
        <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography sx={{ ml: 1, fontWeight: 500 }}>{user.name}</Typography>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 