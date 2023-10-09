const fs = require("fs");
const util = require("util");
const express = require("express");
const router = express.Router();
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
let notesData;

// GET request
router.get("/notes", (req, res) => {
  // Read the notes from the JSON file
  readFileAsync("db/db.json", "utf8")
    .then(function (data) {
      // Parse the data to get an array of objects
      notesData = JSON.parse(data);
      res.json(notesData);
    })
    .catch((err) => {
      console.error("Error reading file: ", err);
      res.status(500).json({ error: "Error reading data." });
    });
});

// POST request
router.post("/notes", (req, res) => {
  readFileAsync("db/db.json", "utf8")
    .then(function (data) {
      // Parse data to get an array of objects
      notesData = JSON.parse(data);

      let newNote = req.body;
      let currentID = notesData.length;

      newNote.id = currentID + 1;
      // Add new note to the array of note objects
      notesData.push(newNote);

      notesData = JSON.stringify(notesData);

      writeFileAsync("db/db.json", notesData)
        .then(function () {
          console.log("Note has been added.");
          res.json(newNote);
        })
        .catch((err) => {
          console.error("Error writing file: ", err);
          res.status(500).json({ error: "Error writing data." });
        });
    });
});

// DELETE request
router.delete("/notes/:id", (req, res) => {
  let selID = parseInt(req.params.id);
  // Read JSON file
  for (let i = 0; i < notesData.length; i++) {
    if (selID === notesData[i].id) {
      notesData.splice(i, 1);
      let noteJSON = JSON.stringify(notesData, null, 2);

      writeFileAsync("db/db.json", noteJSON)
        .then(function () {
          console.log("Note has been deleted.");
          res.json({ message: "Note deleted successfully." });
        })
        .catch((err) => {
          console.error("Error writing file: ", err);
          res.status(500).json({ error: "Error writing data." });
        });
    }
  }
});

module.exports = router;