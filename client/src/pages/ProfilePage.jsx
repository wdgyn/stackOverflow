import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";

function ProfilePage() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
    password: ""
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    Api.fetchUserProfile(userId, username)
      .then((res) => res.json())
      .then((data) => {
        setProfile(prev => ({
          ...prev,
          fullName: data.fullName || "",
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          profilePicture: data.profilePicture || ""
        }));
      });
  }, [userId, username]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, profilePicture: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    Api.updateUserProfile(userId, profile, token)
      .then(res => res.json())
      .then(msg => {
        alert("Profile updated successfully!");
  
        localStorage.setItem("username", profile.username);
        window.dispatchEvent(new Event("storage")); // trigger refresh in ForumPage
      })
      .catch(err => alert("Update failed."));
  };

  const handleChangePassword = () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }
  
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
  
    Api.changePassword(userId, currentPassword, newPassword, token)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          alert("Password updated successfully!");
          setPasswordDialogOpen(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        } else {
          alert(data.error || "Failed to change password.");
        }
      })
      .catch((err) => {
        alert("Something went wrong. Try again later.");
      });
    };

  return (
    <Box sx={{ width: 500, mx: "auto", mt: 5 }}>
      <Button variant="outlined" onClick={() => navigate("/questions")}>
        ← Back to Home
      </Button>

      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>My Profile</Typography>

      <Stack spacing={2}>
        <Avatar src={profile.profilePicture} sx={{ width: 80, height: 80 }} />
        <Button component="label" variant="outlined">Upload Picture
          <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
        </Button>

        <TextField label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} fullWidth />
        <TextField label="Username" name="username" value={profile.username} onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" value={profile.email} onChange={handleChange} fullWidth />
        <TextField label="Bio" name="bio" value={profile.bio} onChange={handleChange} fullWidth multiline minRows={3} />

        <Button variant="outlined" onClick={() => setPasswordDialogOpen(true)}>Change Password</Button>
        <Button variant="contained" onClick={handleSave}>Save Changes</Button>
      </Stack>

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="dense"
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword}>Save Password</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfilePage;
