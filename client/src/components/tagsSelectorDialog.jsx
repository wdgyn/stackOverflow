import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel
} from "@mui/material";
import Api from "../services/api";

function TagSelectorDialog({ open, onClose, onApply }) {
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (open) {
      Api.fetchAllQuestionTags()
        .then((res) => res.json())
        .then((data) => setTagOptions(data.tags || []))
        .catch((err) => console.error("Failed to fetch tags:", err));
    }
  }, [open]);

  const handleTagChange = (event) => {
    const tag = event.target.value;
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleApply = () => {
    onApply(selectedTags);
    setSelectedTags([]); // Reset for next time
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Tags</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Choose which tags you'd like to filter by.
        </DialogContentText>
        <FormGroup>
          {tagOptions.map((tag, idx) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onChange={handleTagChange}
                  value={tag}
                />
              }
              label={tag}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">Apply</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TagSelectorDialog;
