const API_BASE = "https://m1lqe0htre.execute-api.us-east-2.amazonaws.com/prod"; // <-- API Gateway base

// SAVE a new journal entry
const saveForm = document.getElementById("journalForm");
if (saveForm) {
  saveForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("entry").value;

    try {
      const response = await fetch(`${API_BASE}/saveEntry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
      });

      if (response.ok) {
        document.getElementById("statusMessage").classList.remove("hidden");
        saveForm.reset();
      } else {
        const error = await response.text();
        console.error("Save failed:", error);
        alert("Error saving entry. See console for details.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Request failed. See console for details.");
    }
  });
}

// LOAD and DISPLAY entries
const entriesContainer = document.getElementById("entriesContainer");
if (entriesContainer) {
  async function loadEntries() {
    try {
      const response = await fetch(`${API_BASE}/getEntries`);
      const result = await response.json();
      const entries = result.entries || [];

      entriesContainer.innerHTML = "";

      if (entries.length === 0) {
        entriesContainer.innerHTML = `<p class="text-center text-gray-500">No journal entries found.</p>`;
        return;
      }

      entries.forEach(entry => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow mb-4";
        card.innerHTML = `
          <h3 class="text-lg font-bold">${entry.title}</h3>
          <p class="text-gray-700 mt-2">${entry.content}</p>
          <p class="text-sm text-gray-500 mt-1">${new Date(entry.timestamp).toLocaleString()}</p>
          <button data-id="${entry.entryID}" class="delete-btn mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            Delete
          </button>
        `;
        entriesContainer.appendChild(card);
      });

      // Attach DELETE functionality
      document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          if (!id || !confirm("Are you sure you want to delete this entry?")) return;

          try {
            const delRes = await fetch(`${API_BASE}/deleteEntry`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ entryId: id })
            });

            if (delRes.ok) {
              console.log("Entry deleted:", id);
              loadEntries(); // Reload entries
            } else {
              const errorText = await delRes.text();
              console.error("Delete failed:", errorText);
              alert("Error deleting entry.");
            }
          } catch (err) {
            console.error("Delete error:", err);
            alert("Delete request failed.");
          }
        });
      });

    } catch (err) {
      entriesContainer.innerHTML = `<p class="text-red-500">Failed to load entries. Try again later.</p>`;
      console.error("Load error:", err);
    }
  }

  // Load on page load
  loadEntries();
}
