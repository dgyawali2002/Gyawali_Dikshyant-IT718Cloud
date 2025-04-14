const API_BASE = "https://m1lqe0htre.execute-api.us-east-2.amazonaws.com";

// Save a new journal entry
const saveForm = document.getElementById("journalForm");
if (saveForm) {
  saveForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const entry = document.getElementById("entry").value;

    const response = await fetch(`${API_BASE}/saveEntry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, entry })
    });

    if (response.ok) {
      document.getElementById("statusMessage").classList.remove("hidden");
      saveForm.reset();
    } else {
      alert("Error saving entry.");
    }
  });
}

// Fetch and display entries
const entriesContainer = document.getElementById("entriesContainer");
if (entriesContainer) {
  async function loadEntries() {
    const res = await fetch(`${API_BASE}/getEntries`);
    const data = await res.json();

    entriesContainer.innerHTML = "";
    data.forEach(entry => {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow mb-4";
      div.innerHTML = `
        <h3 class="text-lg font-bold">${entry.title}</h3>
        <p class="text-gray-700 mt-2">${entry.content}</p>
        <p class="text-sm text-gray-500 mt-1">${new Date(entry.timestamp).toLocaleString()}</p>
        <button data-id="${entry.entryId}" class="delete-btn mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
      `;
      entriesContainer.appendChild(div);
    });

    // Set up delete buttons
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");

        const res = await fetch(`${API_BASE}/deleteEntry`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId: id })
        });

        if (res.ok) {
          loadEntries(); // reload entries
        } else {
          alert("Error deleting entry.");
        }
      });
    });
  }

  // Load entries on page load
  loadEntries();
}
