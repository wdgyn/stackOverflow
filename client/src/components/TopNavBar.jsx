import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Paper,
  InputBase,
  IconButton,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, Link } from "react-router-dom";

function TopNavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    window.dispatchEvent(new Event("storage")); // Force any listener (like in ForumPage) to react immediately
    navigate("/questions");
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-evenly' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/questions">
            <img
              src="https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-logo.png"
              alt="logo"
              height="30"
              style={{ marginRight: '16px' }}
            />
          </Link>
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ display: 'flex', alignItems: 'center', width: 400, borderRadius: 1, pl: 1 }}
            elevation={0}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        <Box>
          {isLoggedIn ? (
            <>
              <Button variant="outlined" sx={{ mr: 1 }} component={Link} to="/profile">Profile</Button>
              <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="outlined" sx={{ mr: 1 }} component={Link} to="/login">Log in</Button>
              <Button variant="contained" component={Link} to="/register">Sign up</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavBar;
