let notes = []
let editNoteID = null

function loadNotes() {
    const savedNotes = localStorage.getItem('myNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}

function saveNote(event) {
    event.preventDefault()

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (editNoteID) {
        //update note
        const noteIndex = notes.findIndex(note => note.id === editNoteID)
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }
    }
    else {
        //add new note
        notes.unshift({
        id: generateId(),
        title: title,
        content: content
    })
    }

    closeNote()
    saveNotes()
    renderNotes()
}

function saveNotes() {
    localStorage.setItem('myNotes', JSON.stringify(notes))
}

function generateId() {
    return Date.now().toString();
}

function renderNotes() {
    const notesContainer = document.getElementById('notesContainer')

    if (notes.length === 0) {
        //when theres no notes
        notesContainer.innerHTML = `
        <div class="emptyState">
            <h2>No Notes</h2>
            <button class="addNoteBtn" onclick="openNote()">Add First Note</button>
        </div>
        `
        return
    }
    notesContainer.innerHTML = notes.map(note => `
        <div class="noteCard">
            <h3 class="noteTitle">${note.title}</h3>
            <p class="noteContent">${note.content}</p>
            <div class="noteActions">
            <button class="editBtn" onclick="openNote('${note.id}')" title="Edit Note">✍️</button>
            <button class="deleteBtn" onclick="deleteNote('${note.id}')" title="Delete Note">❌</button>
            </div>
        </div>
        `).join('')
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId)
    saveNotes()
    renderNotes()
}

function openNote(noteId = null) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if (noteId) {
        //editing
        const noteToEdit = notes.find(note => note.id === noteId)
        editNoteID = noteId
        document.getElementById('dialogTitle').textContent = 'Edit Note'
        titleInput.value = noteToEdit.title
        contentInput.value = noteToEdit.content
    }
    else {
        //adding
        editNoteID = null
        document.getElementById('dialogTitle').textContent = 'Add Note'
        titleInput.value = ''
        contentInput.value = ''
    }

    dialog.showModal()
    titleInput.focus()
}

function closeNote() {
    document.getElementById('noteDialog').close()
}

function toggleTheme() {
   const isDark = document.body.classList.toggle('darkTheme') 
   localStorage.setItem('theme', isDark ? 'dark' : 'light')
   document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙'
}

function applyStoredTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('darkTheme')   
        document.getElementById('themeToggle').textContent = '☀️' 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    applyStoredTheme()
    notes = loadNotes()
    renderNotes()

    document.getElementById('noteForm').addEventListener('submit', saveNote)
    document.getElementById('themeToggle').addEventListener('click', toggleTheme)

    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if (event.target === this) {
            closeNote();
        }
    })
})