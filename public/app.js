const totalEl = document.getElementById("totalParcels");
const correctEl = document.getElementById("correctCount");
const wrongEl = document.getElementById("wrongCount");
const unconfirmedEl = document.getElementById("unconfirmedCount");

const updatedEl = document.getElementById("lastUpdated");
const connectionText = document.getElementById("connectionText");
const liveDot = document.querySelector(".live-dot");

const errorEl = document.getElementById("errorMessage");
const refreshBtn = document.getElementById("refreshBtn");


function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
}


async function loadStats() {

  refreshBtn.disabled = true;
  errorEl.textContent = "";

  try {

    const response = await fetch("/api/stats", {
      cache: "no-store"
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Could not load parcel statistics"
      );
    }

    // Update total parcels
    totalEl.textContent =
      Number(data.totalParcels ?? 0).toLocaleString();

    // Update individual counts
    correctEl.textContent =
      Number(data.parcels?.correct ?? 0).toLocaleString();

    wrongEl.textContent =
      Number(data.parcels?.wrong ?? 0).toLocaleString();

    unconfirmedEl.textContent =
      Number(data.parcels?.unconfirmed ?? 0).toLocaleString();

    // Update last device update time
    updatedEl.textContent =
      `Last device update: ${formatDate(data.lastUpdated)}`;

    // Connection status
    connectionText.textContent = "System connected";

    liveDot.classList.add("online");
    liveDot.classList.remove("offline");

  } catch (error) {

    connectionText.textContent = "Connection issue";

    liveDot.classList.add("offline");
    liveDot.classList.remove("online");

    errorEl.textContent =
      `${error.message}. Retrying automatically...`;

  } finally {

    refreshBtn.disabled = false;

  }
}


// Manual refresh button
refreshBtn.addEventListener("click", loadStats);


// Initial data fetch
loadStats();


// Automatically refresh every 20 seconds
setInterval(loadStats, 20000);