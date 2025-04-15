import React from "react";
import { Paper, Typography, Stack, Chip, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const RightSidebar = () => (
  <>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <Button variant="outlined"><Link to="/ask" style={{ textDecoration: "none", color: "inherit" }}> Ask Question </Link> </Button>
    </Box>
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6">Trending Tags</Typography>
      <Stack spacing={1} sx={{ mt: 2 }}>
        <Chip label="react" />
        <Chip label="javascript" />
        <Chip label="node.js" />
        <Chip label="css" />
        <Chip label="webdev" />
      </Stack>
    </Paper>
  </>
);

export default RightSidebar;
