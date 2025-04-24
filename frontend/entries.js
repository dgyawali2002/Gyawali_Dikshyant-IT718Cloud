const API_BASE = "https://m1lqe0htre.execute-api.us-east-2.amazonaws.com/prod";
const COGNITO_DOMAIN = "https://us-east-23irmhphkz.auth.us-east-2.amazoncognito.com";
const CLIENT_ID = "358mc72lkua0r6jcvsqi7oh7c6";
const LOGOUT_REDIRECT_URI = "https://d10qfh3mho4y9r.cloudfront.net"; // update if needed

document.addEventListener("DOMContentLoaded", async () => {
  const token = getIdToken();

  if (!token) {
    // No token, redirect to login
    window.location.href = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=email+openid&redirect_uri=${LOGOUT_REDIRECT_URI}`;
    return;
  }

  await loadEntries(token);

  // Logout handler
  document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_REDIRECT_URI}`;
  });
});

function getIdToken() {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.replace("#", ""));
  const idToken = params.get("id_token");

  if (idToken) {
    localStorage.setItem("id_token", idToken);
    // Remove token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return idToken || localStorage.getItem("id_token");
}

async function loadEntries(token) {
  const entriesContainer = document.getElementById("entriesContainer");

  if (!entriesContainer) {
    console.error("Missing #entriesContainer element");
    return;
  }

  entriesContainer.innerHTML = "<p class='text-gray-500'>Loading entries...</p>";

  try {
    const res = await fetch(`${API_BASE}/getEntries`, {
      headers: {
        Authorization: token
      }
    });

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
        <button data-id="${entry.entryID}" class="delete-btn mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
      `;
      entriesContainer.appendChild(div);
    });

    // Delete entry logic
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");
        if (!id || !confirm("Are you sure you want to delete this entry?")) return;

        try {
          const res = await fetch(`${API_BASE}/deleteEntry`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: token
            },
            body: JSON.stringify({ entryId: id })
          });

          const result = await res.text();

          if (res.ok) {
            console.log("Delete successful:", result);
            loadEntries(token);
          } else {
            console.error("Delete failed:", result);
            alert("Failed to delete entry.");
          }
        } catch (err) {
          alert("Delete request failed. See console.");
          console.error(err);
        }
      });
    });

  } catch (err) {
    entriesContainer.innerHTML = "<p class='text-red-500'>Error loading entries. Try again later.</p>";
    console.error("loadEntries failed:", err);
  }
}
