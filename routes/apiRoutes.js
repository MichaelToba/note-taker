const fs = require("fs").promises;
const express = require("express");
const router = express.Router();
const path = require("path");

const dataFilePath = path.join(__dirname, "db/db.json");

// GET request
router.get("/notes", async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    const notesData = JSON.parse(data);
    res.json(notesData);
  } catch (err) {
    console.error("Error reading file: ", err);
    res.status(500).json({ error: "Error reading data." });
  }
});

// POST request
router.post("/notes", async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    const notesData = JSON.parse(data);

    const newNote = req.body;
    newNote.id = notesData.length + 1;

    notesData.push(newNote);

    const updatedData = JSON.stringify(notesData, null, 2);

    await fs.writeFile(dataFilePath, updatedData);

    console.log("Note has been added.");
    res.json(newNote);
  } catch (err) {
    console.error("Error writing file: ", err);
    res.status(500).json({ error: "Error writing data." });
  }
});

// DELETE request
router.delete("/notes/:id", async (req, res) => {
  try {
    const selID = parseInt(req.params.id);
    const data = await fs.readFile(dataFilePath, "utf8");
    const notesData = JSON.parse(data);

    const updatedNotesData = notesData.filter((note) => note.id !== selID);
    const updatedData = JSON.stringify(updatedNotesData, null, 2);

    await fs.writeFile(dataFilePath, updatedData);

    console.log("Note has been deleted.");
    res.json({ message: "Note deleted successfully." });
  } catch (err) {
    console.error("Error writing file: ", err);
    res.status(500).json({ error: "Error writing data." });
  }
});

module.exports = router;
