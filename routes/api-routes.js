const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../db/db.json'); // Use path for file path

let data = readDataFromFile();

function readDataFromFile() {
  try {
    const fileData = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Error reading data from file:', err);
    return [];
  }
}

function writeDataToFile(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing data to file:', err);
  }
}

module.exports = function (app) {
  app.get('/api/notes', function (req, res) {
    res.json(data);
  });

  app.get('/api/notes/:id', function (req, res) {
    const id = Number(req.params.id);
    if (id >= 0 && id < data.length) {
      res.json(data[id]);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  });

  app.post('/api/notes', function (req, res) {
    const newNote = req.body;
    const uniqueId = String(data.length);
    newNote.id = uniqueId;
    data.push(newNote);
    writeDataToFile(data);
    res.json(data);
  });

  app.delete('/api/notes/:id', function (req, res) {
    const noteId = req.params.id;
    data = data.filter((currentNote) => currentNote.id !== noteId);
    data.forEach((note, index) => {
      note.id = String(index);
    });
    writeDataToFile(data);
    res.json(data);
  });
};