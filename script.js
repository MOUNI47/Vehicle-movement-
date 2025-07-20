let map = L.map("map").setView([17.385044, 78.486671], 16);
let route = [];
let marker, polyline;
let currentIndex = 0;
let interval = null;
let startTime;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

fetch("dummy-route.json")
  .then(response => response.json())
  .then(data => {
    route = data.map(point => [point.latitude, point.longitude]);
    polyline = L.polyline(route, { color: "blue" }).addTo(map);
    marker = L.marker(route[0]).addTo(map);
    L.polyline([route[0]]).addTo(map);
  });

function updateMarker() {
  if (currentIndex >= route.length) {
    clearInterval(interval);
    return;
  }

  const [lat, lng] = route[currentIndex];
  marker.setLatLng([lat, lng]);

  document.getElementById("coords").textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("elapsed").textContent = `${elapsedSeconds} sec`;

  polyline.addLatLng([lat, lng]);
  currentIndex++;
}

document.getElementById("playBtn").addEventListener("click", () => {
  if (!interval) {
    startTime = Date.now();
    interval = setInterval(updateMarker, 2000);
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
});