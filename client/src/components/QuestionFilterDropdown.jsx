import React, { useState, useEffect } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
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

function QuestionFilterDropdown({ filter, setFilter }) {

    const [open, setOpen] = useState(false);
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);


    useEffect(() => {
        if (filter === "tags") {
            setOpen(true); // Open dialog
            Api.fetchAllQuestionTags()
                .then((res) => res.json())
                .then((data) => {
                    // console.log("(questionFilter.jsx) tags:", data) //debug
                    setTagOptions(data.tags);
                })
                .catch((err) => console.error("Failed to fetch tags:", err));
        }
    }, [filter]);

    const handleChange = (event) => {
        setFilter(event.target.value);
    };

    const handleTagChange = (event) => {
        const tag = event.target.value;
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };


    return (
        <>
            <FormControl size="small" sx={{ /*ml:2,*/ mb: 2, width: 150 }}>
                <InputLabel id="filter-label">Filter By</InputLabel>
                <Select
                    labelId="filter-label"
                    id="filter-select"
                    value={filter.startsWith("tags:") ? "tags" : filter}
                    label="Filter By"
                    onChange={handleChange}
                >
                    <MenuItem value="mostRecent">Most Recent</MenuItem>
                    <MenuItem value="hot">Hot</MenuItem>
                    <MenuItem value="tags">Tags</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="h5" gutterBottom>
                {filter === "mostRecent" && "Show Recent Questions"}
                {filter === "hot" && "Hot Questions"}
                {filter === "tags" && "Tag Questions"}
            </Typography>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Select Tags</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose which tag you'd like to filter by.
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
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setOpen(false);

                        if (selectedTags.length > 0) {
                            setFilter("tags:" + selectedTags.join(","));
                        }
                    }}
                    variant="contained">Apply</Button>
                </DialogActions>

            </Dialog>
        </>
    );
}

export default QuestionFilterDropdown;
