const apiBaseUrl = "https://m1lqe0htre.execute-api.us-east-2.amazonaws.com"; //API Gateway base URL

document.addEventListener("DOMContentLoaded", () => {
  loadEntries();
});

async function loadEntries() {
  try {
    const response = await fetch(`${apiBaseUrl}/getEntries`);
    const data = await response.json();
    renderEntries(data.entries || []);
  } catch (error) {
    console.error("Failed to load entries:", error);
  }
}

function renderEntries(entries) {
  const container = document.getElementById("entriesContainer");
  container.innerHTML = ""; // Clear previous content

  if (entries.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-600">No journal entries found.</p>`;
    return;
  }

  entries.forEach((entry) => {
    const entryCard = document.createElement("div");
    entryCard.className = "bg-white p-4 rounded-lg shadow-md";

    entryCard.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-xl font-semibold">${entry.title}</h2>
          <p class="text-gray-600 mt-2">${entry.content}</p>
          <p class="text-xs text-gray-400 mt-1">${new Date(entry.timestamp).toLocaleString()}</p>
        </div>
        <button 
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
          onclick="deleteEntry('${entry.entryId}')"
        >
          Delete
        </button>
      </div>
    `;

    container.appendChild(entryCard);
  });
}

async function deleteEntry(entryId) {
  const confirmed = confirm("Are you sure you want to delete this entry?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${apiBaseUrl}/deleteEntry`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId }),
    });

    const result = await response.json();
    console.log(result.message);
    document.getElementById("statusMessage").classList.remove("hidden");
    loadEntries(); // Reload entries after deletion
  } catch (error) {
    console.error("Failed to delete entry:", error);
  }
}
