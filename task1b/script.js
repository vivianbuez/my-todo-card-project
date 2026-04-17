const timeEl = document.getElementById("time");

// update time every second
function updateTime() {
  timeEl.textContent = Date.now();
}

// initial load
updateTime();

// live update (every 1 second)
setInterval(updateTime, 1000);