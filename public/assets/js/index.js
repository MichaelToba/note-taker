// DOM Elements
const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const noteList = document.querySelectorAll('.list-container .list-group')[0];

// Active note
let activeNote = {};

// Fetch notes from the server
const getNotes = async () => {
  try {
    const response = await fetch('/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

// Save a note to the server
const saveNote = async (note) => {
  try {
    await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
  } catch (error) {
    console.error('Error saving note:', error);
  }
};

// Delete a note from the server
const deleteNote = async (id) => {
  try {
    await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

// Render the active note in the editor
const renderActiveNote = () => {
  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
    hide(saveNoteBtn);
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
    show(saveNoteBtn);
  }
};

// Handle saving a note
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote)
    .then(() => getAndRenderNotes())
    .then(() => renderActiveNote());
};

// Handle deleting a note
const handleNoteDelete = (e) => {
  e.stopPropagation();
  const noteId = e.target.parentElement.getAttribute('data-note-id');
  if (activeNote.id === noteId) {
    activeNote = {};
  }
  deleteNote(noteId)
    .then(() => getAndRenderNotes())
    .then(() => renderActiveNote());
};

// Handle viewing a note
const handleNoteView = (e) => {
  e.preventDefault();
  const noteId = e.target.parentElement.getAttribute('data-note-id');
  activeNote = { ...noteList[noteId] };
  renderActiveNote();
};

// Handle creating a new note
const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

// Render the list of note titles
const renderNoteList = (notes) => {
  noteList.innerHTML = '';

  if (notes.length === 0) {
    noteList.innerHTML = '<li>No saved notes</li>';
  } else {
    notes.forEach((note, index) => {
      const li = createNoteListItem(note, index);
      noteList.appendChild(li);
    });
  }
};

// Create a list item for a note
const createNoteListItem = (note, index) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  li.dataset.noteId = index;

  const span = document.createElement('span');
  span.innerText = note.title;
  span.addEventListener('click', handleNoteView);

  const deleteBtn = document.createElement('i');
  deleteBtn.classList.add(
    'fas',
    'fa-trash-alt',
    'float-right',
    'text-danger',
    'delete-note'
  );
  deleteBtn.addEventListener('click', handleNoteDelete);

  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
};

// Show or hide the save button
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Event Listeners
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('input', handleRenderSaveBtn);
  noteText.addEventListener('input', handleRenderSaveBtn);
}

// Initial setup
const init = async () => {
  try {
    const notes = await getNotes();
    renderNoteList(notes);
  } catch (error) {
    console.error('Error initializing:', error);
  }
};

init();
