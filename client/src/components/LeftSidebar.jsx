import React from "react";
import { Paper, Typography, Stack, Button } from "@mui/material";
import { Link, NavLink } from "react-router-dom";

function LeftSidebar() {
    return (
        <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h6">Navigation</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Button fullWidth variant="outlined">
                    <Link to="/questions" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
                </Button>
                <Button fullWidth variant="outlined">
                    <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>Profile</Link>
                </Button>
                <Button fullWidth variant="outlined">
                    <Link to="/users" style={{ textDecoration: "none", color: "inherit" }}>Users</Link>
                </Button>
            </Stack>
        </Paper>
    );
}

export default LeftSidebar;
