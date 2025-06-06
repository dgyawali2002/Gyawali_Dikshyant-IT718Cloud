const API_BASE = "https://m1lqe0htre.execute-api.us-east-2.amazonaws.com/prod";

document.addEventListener("DOMContentLoaded", () => {
  loadEntries();
});

async function loadEntries() {
  const entriesContainer = document.getElementById("entriesContainer");

  if (!entriesContainer) {
    console.error("Missing #entriesContainer element");
    return;
  }

  entriesContainer.innerHTML = "<p class='text-gray-500'>Loading entries...</p>";

  try {
    const res = await fetch(`${API_BASE}/getEntries`);
    if (!res.ok) throw new Error("Failed to fetch entries");

    const data = await res.json();
    const entries = data.entries || [];

    if (entries.length === 0) {
      entriesContainer.innerHTML = "<p class='text-center text-gray-500'>No journal entries found.</p>";
      return;
    }

    entriesContainer.innerHTML = "";

    entries.forEach(entry => {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow mb-4";
      div.innerHTML = `
        <h3 class="text-lg font-bold">${entry.title}</h3>
        <p class="text-gray-700 mt-2">${entry.content}</p>
        <p class="text-sm text-gray-500 mt-1">${new Date(entry.timestamp).toLocaleString()}</p>
        <button 
          data-id="${entry.entryID}" 
          class="delete-btn mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
          Delete
        </button>
      `;
      entriesContainer.appendChild(div);
    });

    // Attach delete button handlers
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");
        if (!id || !confirm("Are you sure you want to delete this entry?")) return;

        try {
          const res = await fetch(`${API_BASE}/deleteEntry`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ entryId: id })
          });

          const resultText = await res.text();

          if (res.ok) {
            console.log("Delete successful:", resultText);
            loadEntries(); // Reload
          } else {
            console.error("Delete failed:", resultText);
            alert("Failed to delete entry.");
          }

        } catch (err) {
          alert("Delete request failed. See console.");
          console.error("Delete request error:", err);
        }
      });
    });

  } catch (err) {
    entriesContainer.innerHTML = "<p class='text-red-500'>Error loading entries. Try again later.</p>";
    console.error("loadEntries failed:", err);
  }
}
