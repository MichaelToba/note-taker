// Cache jQuery objects
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// Initialize the activeNote
let activeNote = {};

// Function to get all notes from the server
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// Function to save a note to the server
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// Function to delete a note from the server
const deleteNote = (id) => {
  return $.ajax({
    url: `api/notes/${id}`,
    method: "DELETE",
  });
};

// Function to render the active note in the editor
const renderActiveNote = () => {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.prop("readonly", true);
    $noteText.prop("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.prop("readonly", false);
    $noteText.prop("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Function to handle saving a note
const handleNoteSave = () => {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to delete the clicked note
const handleNoteDelete = function (event) {
  event.stopPropagation();

  const note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to set the activeNote and display it
const handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

// Function to set the activeNote to an empty object and allow the user to enter a new note
const handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

// Function to handle rendering the save button
const handleRenderSaveBtn = () => {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Function to render the list of note titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = notes.map((note) => {
    const $li = $("<li class='list-group-item'>").data(note);
    const $span = $("<span>").text(note.title);
    const $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");

    return $li.append($span, $delBtn);
  });

  $noteList.append(noteListItems);
};

// Function to get and render the initial list of notes
const getAndRenderNotes = () => {
  getNotes().then((data) => {
    renderNoteList(data);
  });
};

// Event listeners
$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("input", handleRenderSaveBtn);
$noteText.on("input", handleRenderSaveBtn);

// Initial setup
getAndRenderNotes();
