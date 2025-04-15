import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
  Stack
} from "@mui/material";
import Api from "../services/api";
import { useNavigate } from "react-router-dom";

function UsersListPage() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Api.fetchAllUsers(token)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Failed to fetch users", err));
  }, [token]);

  function formatTimeAgo(dateStr) {
    const time = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5 }}>
      <Button sx={{ mb: 2 }} variant="outlined" onClick={() => navigate("/questions")}>
        ← Back to Home
      </Button>
      <Typography variant="h5" gutterBottom>All Users</Typography>
      <List>
        {users.map((user, index) => (
          <React.Fragment key={user._id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={user.profilePicture} alt={user.username} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="column" spacing={0.5}>
                    <Typography variant="subtitle1"><strong>{user.username || "Unnamed User"}</strong></Typography>
                    <Typography variant="body2" color="text.secondary">Full Name: {user.fullName}</Typography>
                  </Stack>
                }
                secondary={
                  <Stack direction="column" spacing={0.5} sx={{ mt: 1 }}>
                    <Typography variant="body2">Email: {user.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Joined {formatTimeAgo(user.createdAt)}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
            {index < users.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default UsersListPage;
