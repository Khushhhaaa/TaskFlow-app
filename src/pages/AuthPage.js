import React, { useState } from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthPage = () => {
  const [tab, setTab] = useState(0);
  const handleChange = (e, newValue) => setTab(newValue);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 400, width: "100%" }}>
        <Tabs value={tab} onChange={handleChange} centered sx={{ mb: 2 }}>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        {tab === 0 ? <SignIn /> : <SignUp />}
      </Paper>
    </Box>
  );
};

export default AuthPage; 