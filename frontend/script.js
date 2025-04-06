document.getElementById('journalForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const title = document.getElementById('title').value.trim();
    const entry = document.getElementById('entry').value.trim();
    const status = document.getElementById('statusMessage');
  
    if (!entry) return;
  
    // Replace with your API endpoint
    const apiUrl = 'https://your-api-url.amazonaws.com/v1/notes';
  
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include an auth token here if needed
        },
        body: JSON.stringify({
          title,
          content: entry,
          timestamp: new Date().toISOString()
        }),
      });
  
      if (res.ok) {
        status.classList.remove('hidden');
        document.getElementById('journalForm').reset();
      } else {
        alert('Failed to save entry.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to API.');
    }
  });
  