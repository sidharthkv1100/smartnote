let notes = JSON.parse(localStorage.getItem("notes")) || [];
let searchQuery = "";

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function mockAI(text) {
  const moods = ["😊 Happy", "😐 Neutral", "😔 Serious"];
  return {
    summary: text.split(" ").slice(0, 5).join(" ") + "...",
    tags: text.split(" ").slice(0, 3),
    mood: moods[Math.floor(Math.random() * moods.length)]
  };
}

function addNote() {
  const text = document.getElementById("noteText").value.trim();
  if (!text) return;

  const ai = mockAI(text);

  notes.push({
    id: Date.now(),
    text,
    pinned: false,
    createdAt: Date.now(),
    ...ai
  });

  document.getElementById("noteText").value = "";
  saveNotes();
  renderNotes();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes();
}

function togglePin(id) {
  notes = notes.map(n =>
    n.id === id ? { ...n, pinned: !n.pinned } : n
  );
  saveNotes();
  renderNotes();
}

function highlight(text) {
  if (!searchQuery) return text;
  const regex = new RegExp(`(${searchQuery})`, "gi");
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

function renderNotes() {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";

  const sortValue = document.getElementById("sortSelect").value;

  let filtered = notes.filter(n =>
    n.text.toLowerCase().includes(searchQuery)
  );

  filtered.sort((a, b) =>
    sortValue === "newest"
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt
  );

  filtered.sort((a, b) => b.pinned - a.pinned);

  filtered.forEach(note => {
    const div = document.createElement("div");
    div.className = `note-card ${note.pinned ? "pinned" : ""}`;

    div.innerHTML = `
      <p>${highlight(note.text)}</p>
      <h4>🧠 ${note.summary}</h4>
      <small>🏷 ${note.tags.join(", ")}</small><br/>
      <small>${note.mood}</small>
      <div class="note-actions">
        <button onclick="togglePin(${note.id})">📌</button>
        <button onclick="deleteNote(${note.id})">🗑</button>
      </div>
    `;

    container.appendChild(div);
  });
}

document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase();
  renderNotes();
});

document.getElementById("sortSelect").addEventListener("change", renderNotes);

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderNotes();
