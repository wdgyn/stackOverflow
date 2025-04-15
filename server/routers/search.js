import express from "express";

import { performSearch } from "../database/searchDb.js";

const router = express.Router();

// GET /api/search?q=... - Search
router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const results = await performSearch(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
