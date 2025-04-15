import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  Divider,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import Api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const navigate = useNavigate();
  const query = useQuery().get("q");
  const [results, setResults] = useState({ questions: [], answers: [], users: [] });

  useEffect(() => {
    if (query) {
      Api.fetchSearchResults(query)
        .then(res => res.json())
        .then(data => setResults(data))
        .catch(err => console.error("Search error:", err));
    }
  }, [query]);

  return (
    
    
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Button sx={{mb : 2}} variant="outlined" onClick={() => navigate("/questions")}>
        ← Back to Home
      </Button>

      <Typography variant="h4" gutterBottom>
        Search Results for "{query}"
      </Typography>

      {/* Questions */}
      {results.questions.length > 0 && (
        <>
          <Typography variant="h6">Matching Questions</Typography>
          {results.questions.map((q) => (
            <Card key={q._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  <Link to={`/questions/${q._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    {q.title}
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{q.body}</Typography>
                <Stack direction="row" spacing={1}>
                  {q.tags?.map((tag, idx) => (
                    <Chip key={idx} label={tag} size="small" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
          <Divider sx={{ my: 3 }} />
        </>
      )}

      {/* Answers */}
      {results.answers.length > 0 && (
        <>
          <Typography variant="h6">Matching Answers</Typography>
          {results.answers.map((a) => (
            <Card key={a._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body2">{a.body}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Answered by {a.createdBy}
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Divider sx={{ my: 3 }} />
        </>
      )}

      {/* Users */}
      {results.users.length > 0 && (
        <>
          <Typography variant="h6">Matching Users</Typography>
          {results.users.map((u) => (
            <Card key={u._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{u.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">@{u.username}</Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {results.questions.length === 0 && results.answers.length === 0 && results.users.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No results found.
        </Typography>
      )}
    </Box>
  );
}

export default SearchResultsPage;
